import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import mockAxios from "jest-mock-axios";

describe("Jest works", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe("App", () => {
  it("renders the upcoming events component", () => {
    const container = render(<App />);
    const upcomingEvents = container.getByText("Upcoming Events");
    expect(upcomingEvents).toBeInTheDocument();
  });
});

describe("user login", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should render header", () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId("app-header")).toBeInTheDocument();
  });
});
