import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import EventCard from "../components/EventCard";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";

describe("Event Card", () => {
  it("should display image", () => {
    const { getByAltText } = render(
      <EventCard eventDetail={mockEventsWithSeats[0]} />
    );

    expect(getByAltText("Event")).toBeInTheDocument();
  });
});
