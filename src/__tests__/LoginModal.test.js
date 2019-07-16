import React from "react";
import Header from "../components/Header";
import LoginModal from "../components/LoginModal";
import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";

describe("user login", () => {
  it("should open up Login modal when Login button is clicked", () => {
    const { getByText, queryByText } = render(<Header />);

    const loginBtn = getByText("Log In");
    let goBtn;
    goBtn = queryByText("Go!");
    expect(goBtn).not.toBeInTheDocument();

    fireEvent.click(loginBtn);
    goBtn = queryByText("Go!");
    expect(goBtn).toBeInTheDocument();
  });
});
