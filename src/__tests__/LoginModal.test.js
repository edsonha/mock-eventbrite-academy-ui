import React from "react";

import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import LoginModal from "../components/LoginModal";

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

  it("should clear inputs when Cancel button is clicked", () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginModal isOpen={true} />
    );

    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "john@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });
    expect(emailInput).toHaveAttribute("value", "john@gmail.com");
    expect(passwordInput).toHaveAttribute("value", "abcdefgh");
    const cancelBtn = getByText("Cancel");
    fireEvent.click(cancelBtn);
    expect(emailInput).toHaveAttribute("value", "");
    expect(passwordInput).toHaveAttribute("value", "");
  });
});
