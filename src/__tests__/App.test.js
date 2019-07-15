import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

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
