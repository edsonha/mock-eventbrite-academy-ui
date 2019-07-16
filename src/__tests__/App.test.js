import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";

describe("Jest works", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe("App", () => {
  it("renders the upcoming events component", () => {
    const { getByTestId } = render(
      <React.Fragment>
        <App />
      </React.Fragment>
    );
    const upcomingEvents = getByTestId("upcoming-events");
    expect(upcomingEvents).toBeInTheDocument();
  });
});

describe("user login", () => {
  it("should open up Login modal when Login button is clicked", () => {
    const { getByText, queryByText } = render(<App />);

    const loginBtn = getByText("Log In");

    let goBtn;
    goBtn = queryByText("Go!");
    expect(goBtn).not.toBeInTheDocument();

    fireEvent.click(loginBtn);
    goBtn = queryByText("Go!");
    expect(goBtn).toBeInTheDocument();
  });
});
