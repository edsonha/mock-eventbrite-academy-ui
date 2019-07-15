import React from "react";
import ReactDOM from "react-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UpcomingEvents from "../components/UpcomingEvents";

describe("Upcoming Events", () => {
  it("should show 'Stay tuned' message if there is no upcoming events.", () => {
    const { getByText } = render(<UpcomingEvents />);
    expect(getByText("Stay tuned for new events.")).toBeInTheDocument();
  });
});
