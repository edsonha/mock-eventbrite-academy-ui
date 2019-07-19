import React from "react";
import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import SignupModal from "../components/SignupModal";

describe("starting UI", () => {
  it("should render modal component", () => {
    const { getByText, getByLabelText } = render(<SignupModal isOpen={true} />);

    const nameInput = getByLabelText("Name");
    const emailInput = getByLabelText("E-mail");
    const passwordInput = getByLabelText("Password");
    const confirmPasswordInput = getByLabelText("Confirm Password");
    const goBtn = getByText("Go!");
    const clearBtn = getByText("Clear");
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
    expect(clearBtn).toBeInTheDocument();
  });

  it("should clear inputs when Clear button is clicked", () => {
    const { getByText, getByPlaceholderText, getByLabelText } = render(
      <SignupModal isOpen={true} />
    );

    const nameInput = getByLabelText("Name");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByLabelText("Password");
    const confirmPasswordInput = getByLabelText("Confirm Password");
    fireEvent.change(nameInput, { target: { value: "Sally" } });
    fireEvent.change(emailInput, { target: { value: "sally@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123!@#" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123!@#" }
    });
    expect(nameInput).toHaveAttribute("value", "Sally");
    expect(emailInput).toHaveAttribute("value", "sally@gmail.com");
    expect(passwordInput).toHaveAttribute("value", "password123!@#");
    expect(confirmPasswordInput).toHaveAttribute("value", "password123!@#");
    const clearBtn = getByText("Clear");
    fireEvent.click(clearBtn);
    expect(nameInput).toHaveAttribute("value", "");
    expect(emailInput).toHaveAttribute("value", "");
    expect(passwordInput).toHaveAttribute("value", "");
    expect(confirmPasswordInput).toHaveAttribute("value", "");
  });
});
