import React from "react";

import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import LoginModal from "../components/LoginModal";
import Header from "../components/Header";

describe("starting UI", () => {
  it("should render modal component", () => {
    const { getByText, getByLabelText } = render(<LoginModal isOpen={true} />);

    const emailInput = getByLabelText("E-mail");
    const passwordInput = getByLabelText("Password");
    const goBtn = getByText("Go!");
    const cancelBtn = getByText("Cancel");
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });

  it("should close login modal when Cancel button is clicked", async () => {
    const container = render(<Header />);
    const {
      getByText,
      getByPlaceholderText,
      getByTestId,
      queryByTestId
    } = container;

    fireEvent.click(getByText("Log In"));

    expect(await getByTestId("login-modal")).toBeInTheDocument();

    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "john@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });

    expect(emailInput).toHaveAttribute("value", "john@gmail.com");
    expect(passwordInput).toHaveAttribute("value", "abcdefgh");

    fireEvent.click(getByText("×"));
    expect(await queryByTestId("login-modal")).toBe(null);
  });
});
