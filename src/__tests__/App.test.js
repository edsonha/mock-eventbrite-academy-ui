import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";

describe("Jest works", () => {
  it("should run for this simple test", () => {
    expect(1).toBe(1);
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
