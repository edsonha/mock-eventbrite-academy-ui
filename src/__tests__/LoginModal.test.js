import React from "react";

import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import LoginModal from "../components/LoginModal";

describe("starting UI", () => {
  it("should render modal component", () => {
    const { getByText, getByLabelText } = render(<LoginModal isOpen={true} />);

    const emailInput = getByLabelText("E-mail");
    const passwordInput = getByLabelText("Password");
    const signupReminder = getByText("Don't have an account yet?");
    const goBtn = getByText("Go!");
    const cancelBtn = getByText("Cancel");
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signupReminder).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });
});
