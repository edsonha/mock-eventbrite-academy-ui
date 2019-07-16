import React from "react";
import Header from "../components/Header";
import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import LoginModal from "../components/LoginModal";

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

  it("should show Stashaway logo, Welcome message and Log Out button when you are logged in", () => {
    const { getByText, getByTestId } = render(<Header isLoggedIn={true} />);
    const welcomeMessage = getByText("Welcome User");
    const logOutBtn = getByText("Log Out");
    const logo = getByTestId("logo-svg");
    expect(welcomeMessage).toBeInTheDocument();
    expect(logOutBtn).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
  });
});
