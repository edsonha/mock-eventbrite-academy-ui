import React from "react";
import ReactDOM from "react-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UpcomingEvents from "../components/UpcomingEvents";

describe("Upcoming Events", () => {
  it("should show 'Stay tuned' message if there is no upcoming events.", () => {
    const { getByText } = render(<UpcomingEvents upcomingEvents={[]} />);
    expect(getByText("Stay tuned for new events.")).toBeInTheDocument();
  });

  it("should display a Card component if there is an event", () => {
    const { getByText } = render(<UpcomingEvents upcomingEvents={["a"]} />);
    expect(getByText("What is your Plan B?")).toBeInTheDocument();
  });
});
