import React from "react";
import Header from "../components/Header";
import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";

import mockAxios from "jest-mock-axios";

const backendURI = "dummy";

describe("starting UI", () => {
  it("should show Stashaway logo, Login and Sign Up buttons when you are not logged in", () => {
    const { getByText, getByTestId } = render(<Header isLoggedIn={false} />);
    const loginBtn = getByText("Log In");
    const signUpBtn = getByText("Sign Up");
    const logo = getByTestId("logo-svg");
    expect(loginBtn).toBeInTheDocument();
    expect(signUpBtn).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
  });

  it("should clear inputs and close Login Modal when X button is clicked", () => {
    const { getAllByText, getByPlaceholderText, getByText } = render(
      <Header isLoggedIn={false} />
    );

    const headerLoginBtn = getAllByText("Log In")[0];
    fireEvent.click(headerLoginBtn);
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "john@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });

    expect(emailInput).toHaveAttribute("value", "john@gmail.com");
    expect(passwordInput).toHaveAttribute("value", "abcdefgh");

    const closeBtn = getByText("×");
    fireEvent.click(closeBtn);
    fireEvent.click(headerLoginBtn);
    expect(emailInput).toHaveAttribute("value", "");
    expect(passwordInput).toHaveAttribute("value", "");
  });
});

describe("login functionality", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it('should login user when correct info is given and the header will show "Welcome John" and "Log Out" button', async () => {
    const { getByText, getAllByText, getByPlaceholderText } = render(
      <Header backendURI={backendURI} />
    );

    const headerLoginBtn = getAllByText("Log In")[0];
    fireEvent.click(headerLoginBtn);
    const goBtn = getByText("Go!");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "john@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });
    fireEvent.click(goBtn);

    mockAxios.mockResponse({ data: { name: "John Wick" } });
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith("dummy/login", {
      email: "john@gmail.com",
      password: "abcdefgh"
    });

    const logOutBtn = getByText("Log Out");
    const welcomeMessage = getByText("JW");
    expect(emailInput).not.toBeInTheDocument();

    expect(welcomeMessage).toBeInTheDocument();
    expect(logOutBtn).toBeInTheDocument();
  });

  it("should deny login when credentials are wrong", async () => {
    const { getByText, getAllByText, getByPlaceholderText } = render(
      <Header backendURI={backendURI} />
    );

    const headerLoginBtn = getAllByText("Log In")[0];
    fireEvent.click(headerLoginBtn);
    const goBtn = getByText("Go!");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "peter@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(goBtn);

    mockAxios.mockError({
      response: { data: { message: "Wrong credentials" } }
    });
    expect(mockAxios.post).toHaveBeenCalledTimes(1);

    expect(goBtn).toBeInTheDocument();
  });
});

describe("logout functionality", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should return to default ui after logout", () => {
    const { getByText } = render(<Header backendURI={backendURI} />);

    let headerLoginBtn = getByText("Log In");
    let headerSignupBtn = getByText("Sign Up");

    fireEvent.click(headerLoginBtn);
    const goBtn = getByText("Go!");
    fireEvent.click(goBtn);

    mockAxios.mockResponse({ data: { name: "John Wick" } });
    expect(headerLoginBtn).not.toBeInTheDocument();
    expect(headerSignupBtn).not.toBeInTheDocument();

    const logOutBtn = getByText("Log Out");
    fireEvent.click(logOutBtn);
    headerLoginBtn = getByText("Log In");
    headerSignupBtn = getByText("Sign Up");
    expect(headerLoginBtn).toBeInTheDocument();
    expect(headerSignupBtn).toBeInTheDocument();
  });
});
