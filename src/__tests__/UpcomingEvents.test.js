import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import UpcomingEvents from "../components/UpcomingEvents";
// import mockEvents from "../__mockData__/mockEvents.mockdata";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import mockAxios from "jest-mock-axios";
const mockDate = require("mockdate");

describe("Upcoming Events Component", () => {
  const backendURI = "dummy";

  beforeEach(() => {
    mockDate.set("2019-08-14");
  });
  afterEach(() => {
    mockDate.reset();
    mockAxios.reset();
  });

  it("should display 'Upcoming Events' as section title", () => {
    const { getByText } = render(<UpcomingEvents backendURI={backendURI} />);
    expect(getByText("Upcoming Events")).toBeInTheDocument();
  });

  it.only("should show 'Stay tuned' message if there is no upcoming events.", () => {
    const { getByText } = render(<UpcomingEvents backendURI={backendURI} />);
    const mockResponse = mockAxios.mockResponse({ data: [] });
    console.log(mockResponse);

    expect(mockAxios.get).toHaveBeenCalledWith("dummy/upcomingevents");
    expect(getByText("Stay tuned for new events.")).toBeInTheDocument();
  });

  it("should display required event details for one event", () => {
    const { getByText } = render(
      <UpcomingEvents upcomingEvents={[mockEventsWithSeats[0]]} />
    );

    expect(getByText("Event 1")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum 1.")).toBeInTheDocument();
    expect(getByText("By: Speaker 1")).toBeInTheDocument();
    expect(
      getByText("On: Thursday, August 15th 2019, 7:00 pm")
    ).toBeInTheDocument();
    expect(getByText("Duration: 2hr")).toBeInTheDocument();
    expect(getByText("At: Location 1")).toBeInTheDocument();
    expect(getByText("Register")).toBeInTheDocument();
  });

  it("should display required event details for more than one event", () => {
    const { getByText, getAllByText } = render(
      <UpcomingEvents upcomingEvents={mockEventsWithSeats} />
    );

    expect(getByText("Event 1")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum 1.")).toBeInTheDocument();
    expect(getByText("By: Speaker 1")).toBeInTheDocument();
    expect(getByText("At: Location 1")).toBeInTheDocument();

    expect(getByText("Event 2")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum 2.")).toBeInTheDocument();
    expect(getByText("By: Speaker 2")).toBeInTheDocument();
    expect(getByText("At: Location 2")).toBeInTheDocument();

    expect(getAllByText("Duration: 2hr").length).toBe(2);
    expect(getAllByText("On: Thursday, August 15th 2019, 7:00 pm").length).toBe(
      2
    );

    expect(getByText("Event 3")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum 3.")).toBeInTheDocument();
    expect(getByText("By: Speaker 3")).toBeInTheDocument();

    expect(getByText("At: Location 3")).toBeInTheDocument();
    expect(getByText("Event 4")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum 4.")).toBeInTheDocument();
    expect(getByText("By: Speaker 4")).toBeInTheDocument();
    expect(getByText("At: Location 4")).toBeInTheDocument();

    expect(getAllByText("Duration: 1.5hr").length).toBe(2);
    expect(getAllByText("On: Saturday, August 17th 2019, 6:00 pm").length).toBe(
      2
    );

    expect(getAllByText("Register").length).toBe(4);
  });
});

describe("Upcoming Event Display Logic", () => {
  beforeEach(() => {
    mockDate.set("2019-08-14");
  });
  afterEach(() => {
    mockDate.reset();
  });

  it("should display future events regardless of seats availability", () => {
    const { getByText } = render(
      <UpcomingEvents upcomingEvents={mockEventsWithSeats} />
    );
    expect(getByText("Event 1")).toBeInTheDocument();
    expect(getByText("Event 2")).toBeInTheDocument();
    expect(getByText("Event 3")).toBeInTheDocument();
    expect(getByText("Event 4")).toBeInTheDocument();
  });

  it("should NOT display past events regardless of seat availability", () => {
    mockDate.set("2019-08-16");

    const { getByText, queryByText } = render(
      <UpcomingEvents upcomingEvents={mockEventsWithSeats} />
    );
    expect(queryByText("Event 1")).not.toBeInTheDocument();
    expect(queryByText("Event 2")).not.toBeInTheDocument();
    expect(getByText("Event 3")).toBeInTheDocument();
    expect(getByText("Event 4")).toBeInTheDocument();
  });

  it("should display today's events that are not started regardless of seat availability", () => {
    mockDate.set("2019-08-17T09:59:59Z");

    const { getByText, queryByText } = render(
      <UpcomingEvents upcomingEvents={mockEventsWithSeats} />
    );
    expect(queryByText("Event 1")).not.toBeInTheDocument();
    expect(queryByText("Event 2")).not.toBeInTheDocument();
    expect(getByText("Event 3")).toBeInTheDocument();
    expect(getByText("Event 4")).toBeInTheDocument();
  });

  it("should NOT display today's events that are started regardless of seat availability", () => {
    mockDate.set("2019-08-15T11:01:00Z");

    const { getByText, queryByText } = render(
      <UpcomingEvents upcomingEvents={mockEventsWithSeats} />
    );
    expect(queryByText("Event 1")).not.toBeInTheDocument();
    expect(queryByText("Event 2")).not.toBeInTheDocument();
    expect(getByText("Event 3")).toBeInTheDocument();
    expect(getByText("Event 4")).toBeInTheDocument();
  });
});
