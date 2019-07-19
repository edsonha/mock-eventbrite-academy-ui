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
    const clearBtn = getByText("Clear");
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
    expect(clearBtn).toBeInTheDocument();
  });

  it("should clear inputs when Clear button is clicked", () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginModal isOpen={true} />
    );

    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "john@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });
    expect(emailInput).toHaveAttribute("value", "john@gmail.com");
    expect(passwordInput).toHaveAttribute("value", "abcdefgh");
    const clearBtn = getByText("Clear");
    fireEvent.click(clearBtn);
    expect(emailInput).toHaveAttribute("value", "");
    expect(passwordInput).toHaveAttribute("value", "");
  });
});
