import React from "react";
import Header from "../components/Header";
import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent, queryByAltText } from "@testing-library/react";

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

  it("should clear inputs and close Login Modal when X button is clicked", async () => {
    const {
      getAllByText,
      getByPlaceholderText,
      getByText,
      queryByTestId
    } = render(<Header isLoggedIn={false} />);

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
    expect(await queryByTestId("login-modal")).toBe(null);
  });

  it("should clear inputs and close Signup Modal when X button is clicked", async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByLabelText,
      queryByTestId
    } = render(<Header />);

    let headerSignupBtn = getByText("Sign Up");
    fireEvent.click(headerSignupBtn);
    const nameInput = getByLabelText("Name");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByLabelText("Password");
    const passwordConfirmationInput = getByLabelText("Confirm Password");
    fireEvent.change(nameInput, { target: { value: "Sally" } });
    fireEvent.change(emailInput, { target: { value: "sally@hotmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123!@#" } });
    fireEvent.change(passwordConfirmationInput, {
      target: { value: "password123!@#" }
    });
    expect(nameInput).toHaveAttribute("value", "Sally");
    expect(emailInput).toHaveAttribute("value", "sally@hotmail.com");
    expect(passwordInput).toHaveAttribute("value", "password123!@#");
    expect(passwordConfirmationInput).toHaveAttribute(
      "value",
      "password123!@#"
    );

    const closeBtn = getByText("×");
    fireEvent.click(closeBtn);
    expect(await queryByTestId("signup-header")).toBe(null);
  });
});

describe("login functionality", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it('should login user when correct info is given and the header will show "Welcome John" and "Log Out" button', () => {
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
    expect(mockAxios.post).toHaveBeenCalledWith("dummy/users/login", {
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

describe("sign up functionlaity", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should display 'Account created! when registration succeeds", () => {
    const container = render(<Header backendURI={backendURI} />);
    const {
      getByText,
      getAllByText,
      getByPlaceholderText,
      getByLabelText
    } = container;
    const headerSignupBtn = getAllByText("Sign Up")[0];
    fireEvent.click(headerSignupBtn);

    const goBtn = getByText("Go!");
    const nameInput = getByPlaceholderText("username");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByLabelText("Password");
    const passwordConfirmationInput = getByLabelText("Confirm Password");

    fireEvent.change(nameInput, { target: { value: "Sally" } });
    fireEvent.change(emailInput, { target: { value: "sally@hotmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123!@#" } });
    fireEvent.change(passwordConfirmationInput, {
      target: { value: "password123!@#" }
    });
    fireEvent.click(goBtn);

    mockAxios.mockResponse({ data: { message: "Account created!" } });
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith("dummy/users/register", {
      name: "Sally",
      email: "sally@hotmail.com",
      password: "password123!@#",
      passwordConfirmation: "password123!@#"
    });
    const messageBox = getByText("Account created!");
    expect(messageBox).toBeInTheDocument();
  });

  it("should deny register when input is invalid", async () => {
    const { getByText, getByPlaceholderText, getByLabelText } = render(
      <Header backendURI={backendURI} />
    );

    const headerSignupBtn = getByText("Sign Up");
    fireEvent.click(headerSignupBtn);
    const goBtn = getByText("Go!");
    const nameInput = getByLabelText("Name");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByLabelText("Password");
    const passwordConfirmationInput = getByLabelText("Confirm Password");
    fireEvent.change(nameInput, { target: { value: "Sally" } });
    fireEvent.change(emailInput, { target: { value: "sally@hotmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password1" } });
    fireEvent.change(passwordConfirmationInput, {
      target: { value: "password" }
    });

    fireEvent.click(goBtn);

    // mockAxios.mockError({
    //   response: { data: { message: "Cannot create account" } }
    // });
    mockAxios.mockResponse({ data: { message: "Cannot create account" } });
    expect(mockAxios.post).toHaveBeenCalledTimes(1);

    const messageBox = getByText("Cannot create account");
    expect(messageBox).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
  });

  it("should show 'Cannot create account in case of server error", async () => {
    const { getByText, getByPlaceholderText, getByLabelText } = render(
      <Header backendURI={backendURI} />
    );

    const headerSignupBtn = getByText("Sign Up");
    fireEvent.click(headerSignupBtn);

    const goBtn = getByText("Go!");
    const nameInput = getByLabelText("Name");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByLabelText("Password");
    const passwordConfirmationInput = getByLabelText("Confirm Password");

    fireEvent.change(nameInput, { target: { value: "Sally" } });
    fireEvent.change(emailInput, { target: { value: "sally@hotmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123!@#" } });
    fireEvent.change(passwordConfirmationInput, {
      target: { value: "password123!@#" }
    });
    fireEvent.click(goBtn);
    mockAxios.mockError({
      response: { data: { message: "Something went wrong, please try again" } }
    });

    const messageBox = getByText("Something went wrong, please try again");
    expect(messageBox).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
  });
});
