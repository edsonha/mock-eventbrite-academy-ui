import React from "react";
import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import SignupModal from "../components/SignupModal";
import mockAxios from "jest-mock-axios";

const mockShowSignupModal = jest.fn();
const mockShowLoginModal = jest.fn();
const mockHistory = {
  location: { pathname: "/" },
  push: jest.fn()
};

const renderSignupModal = () => {
  const {
    getByText,
    getAllByText,
    getByTestId,
    getByLabelText,
    queryByText,
    queryByTestId,
    getByPlaceholderText
  } = render(
    <SignupModal
      isOpen={true}
      showLoginModal={mockShowLoginModal}
      showSignupModal={mockShowSignupModal}
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

describe("Sign Up modal UI", () => {
  it("should render modal component", () => {
    const { getByText, getByLabelText } = render(<SignupModal isOpen={true} />);

    const nameInput = getByLabelText("Name");
    const emailInput = getByLabelText("E-mail");
    const passwordInput = getByLabelText("Password");
    const confirmPasswordInput = getByLabelText("Confirm Password");
    const loginReminder = getByText("Already have an account?");
    const goBtn = getByText("Go!");
    const cancelBtn = getByText("Cancel");
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(loginReminder).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });
});

describe("Closing of modal", () => {
  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it("should close signup modal when x button is clicked", async () => {
    const { getByText } = renderSignupModal();
    fireEvent.click(getByText("×"));
    expect(mockShowSignupModal).toHaveBeenCalledTimes(1);
  });

  it("should close signup modal when Cancel button is clicked", async () => {
    const { getByText } = renderSignupModal();
    fireEvent.click(getByText("Cancel"));
    expect(mockShowSignupModal).toHaveBeenCalledTimes(1);
  });
});

describe("clearing input", () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it("should clear the sign up form when login is successful", async () => {
    const { getByLabelText, getByText, queryByText } = renderSignupModal();
    const nameField = getByLabelText("Name");
    const emailField = getByLabelText("E-mail");
    const passwordField = getByLabelText("Password");
    const confirmPasswordField = getByLabelText("Confirm Password");
    const goBtn = getByText("Go!");
    fireEvent.change(nameField, { target: { value: "John" } });
    fireEvent.change(emailField, { target: { value: "john@gmail.com" } });
    fireEvent.change(passwordField, { target: { value: "abcedfgh" } });
    fireEvent.change(confirmPasswordField, { target: { value: "abcedfgh" } });
    fireEvent.click(goBtn);
    mockAxios.mockResponse();
    expect(queryByText("john@gmail.com")).not.toBeInTheDocument();
    expect(queryByText("abcdefgh")).not.toBeInTheDocument();
  });
});

describe("signup functionality", () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it("should signup user when correct info is given and store JWT token in session storage", () => {
    delete window.location;
window.location = { reload: jest.fn() };
    const { getByText } = renderSignupModal();
    const spySessionStorageSetItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "setItem"
    );
    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    const goBtn = getByText("Go!");
    fireEvent.click(goBtn);
    mockAxios.mockResponse({
      data: { message: "Account created!", jwtToken: mockJwtToken }
    });
    expect(window.location.reload).toHaveBeenCalledTimes(1)

    expect(spySessionStorageSetItem).toHaveBeenCalledWith("JWT", mockJwtToken);
    expect(spySessionStorageSetItem).toHaveBeenCalledTimes(1);

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
  });

  it("should deny signup when credentials are wrong and show an error message", async () => {
    const { getByText } = renderSignupModal();

    const goBtn = getByText("Go!");

    fireEvent.click(goBtn);

    mockAxios.mockError({
      response: { data: { message: "Could not create account" } }
    });
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(getByText("Could not create account")).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
  });
});

describe("Open login modal", () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it("should open up log in modal when log in link is clicked", async () => {
    const { getByText } = renderSignupModal();

    const linkToLogIn = getByText("Log In!");
    fireEvent.click(linkToLogIn);

    expect(mockShowLoginModal).toHaveBeenCalledTimes(1);
  });
});
