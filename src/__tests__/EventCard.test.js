import React from "react";
import { render, fireEvent } from "@testing-library/react";
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

  it("should display placeholder image if image does not exit", () => {
    const eventWithoutImage = Object.assign({}, mockEventsWithSeats[0]);
    delete eventWithoutImage.image;
    const { getByTestId } = render(
      <EventCard eventDetail={mockEventsWithSeats} />
    );
    expect(getByTestId("event-image")).toHaveAttribute(
      "src",
      "/eventDefault.png"
    );
  });
});
