import React from "react";
import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import LoginModal from "../components/LoginModal";
import mockAxios from "jest-mock-axios";

const mockShowLoginModal = jest.fn();
const mockShowSignupModal = jest.fn();
const mockHistory = {
  location: { pathname: "/" },
  push: jest.fn()
};
const renderLoginModal = () => {
  const {
    getByText,
    getAllByText,
    getByTestId,
    getByLabelText,
    queryByText,
    queryByTestId,
    getByPlaceholderText
  } = render(
    <LoginModal
      isOpen={true}
      showLoginModal={mockShowLoginModal}
      showSignupModal={mockShowSignupModal}
      history={mockHistory}
      notFromRegisterBtn={true}
      updateRegisteredEvents={jest.fn()}
    />
  );
  return {
    getByText,
    getAllByText,
    getByTestId,
    getByLabelText,
    queryByText,
    queryByTestId,
    getByPlaceholderText
  };
};

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

describe("Login Modal UI", () => {
  it("should render modal component", () => {
    const { getByText, getByLabelText } = renderLoginModal();

    const loginHeader = getByText("Log In");
    const closeBtn = getByText("×");
    const emailInput = getByLabelText("E-mail");
    const passwordInput = getByLabelText("Password");
    const signupReminder = getByText("Don't have an account yet?");
    const goBtn = getByText("Go!");
    const cancelBtn = getByText("Cancel");
    expect(loginHeader).toBeInTheDocument();
    expect(closeBtn).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signupReminder).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });
});

describe("Closing of modal", () => {


  it("should close login modal when x button is clicked", async () => {
    const { getByText } = renderLoginModal();
    fireEvent.click(getByText("×"));
    expect(mockShowLoginModal).toHaveBeenCalledTimes(1);
  });

  it("should close login modal when Cancel button is clicked", async () => {
    const { getByText } = renderLoginModal();
    fireEvent.click(getByText("Cancel"));
    expect(mockShowLoginModal).toHaveBeenCalledTimes(1);
  });
});

describe("clearing input", () => {

  it("should clear the email and password field when login is successful", async () => {
    const { getByLabelText, getByText, queryByText } = renderLoginModal();
    const emailField = getByLabelText("E-mail");
    const passwordField = getByLabelText("Password");
    const goBtn = getByText("Go!");
    fireEvent.change(emailField, { target: { value: "john@gmail.com" } });
    fireEvent.change(passwordField, { target: { value: "abcedfgh" } });
    fireEvent.click(goBtn);
    mockAxios.mockResponse({ data: { name: "John Wick" } });
    mockAxios.mockResponse({ data: [] });
    expect(queryByText("john@gmail.com")).not.toBeInTheDocument();
    expect(queryByText("abcdefgh")).not.toBeInTheDocument();
  });
});

describe("login functionality", () => {

  it("should login user when correct info is given and store JWT token in session storage", () => {
    const { getByText } = renderLoginModal();
    const spySessionStorageSetItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "setItem"
    );
    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    const goBtn = getByText("Go!");
    fireEvent.click(goBtn);
    mockAxios.mockResponse({
      data: { name: "John Wick", jwtToken: mockJwtToken }
    });

    mockAxios.mockResponse({
      data: []
    });
    expect(spySessionStorageSetItem).toHaveBeenCalledWith("JWT", mockJwtToken);

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
  });

  it("should deny login when credentials are wrong and show an error message", async () => {
    const { getByText } = renderLoginModal();

    const goBtn = getByText("Go!");

    fireEvent.click(goBtn);

    mockAxios.mockError({
      response: { data: { message: "Wrong credentials" } }
    });
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(getByText("Wrong credentials")).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
  });
});

describe("Open signup modal", () => {

  it("should open up sign up modal when sign up link is clicked", async () => {
    const { getByText } = renderLoginModal();

    const linkToSignUp = getByText("Sign Up!");
    fireEvent.click(linkToSignUp);

    expect(mockShowSignupModal).toHaveBeenCalledTimes(1);
  });
});
