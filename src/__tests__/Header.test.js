import React from "react";
import Header from "../components/Header";
import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";

describe("starting UI", () => {
  test("should show Stashaway logo, Login and Sign Up buttons", () => {
    const { getByText, getByTestId } = render(<Header />);
    const loginBtn = getByText("Log In");
    const signUpBtn = getByText("Sign Up");
    const logo = getByTestId("logo-svg");
    expect(loginBtn).toBeInTheDocument();
    expect(signUpBtn).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
  });
});
