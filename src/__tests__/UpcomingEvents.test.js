import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import UpcomingEvents from "../components/UpcomingEvents";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import mockAxios from "jest-mock-axios";
const mockDate = require("mockdate");

describe("Upcoming Events Component", () => {
  beforeEach(() => {
    mockDate.set("2019-08-14");
  });
  afterEach(() => {
    mockDate.reset();
    mockAxios.reset();
  });

  it("should display 'Upcoming Events' as section title", () => {
    const { getByText } = render(<UpcomingEvents />);
    expect(getByText("Upcoming Events")).toBeInTheDocument();
  });

  it("should show 'Stay tuned' message if there is no upcoming events.", () => {
    const { getByText } = render(<UpcomingEvents />);
    mockAxios.mockResponse({ data: [] });

    expect(getByText("Stay tuned for new events.")).toBeInTheDocument();
  });

  it("should show 'Try again' message if there is an error with the api call", () => {
    const { getByText } = render(<UpcomingEvents />);
    mockAxios.mockError();

    expect(
      getByText("Oops, something went wrong. Please try again later")
    ).toBeInTheDocument();
  });

  it("should display required event details for one event", () => {
    const { getByText } = render(<UpcomingEvents />);
    mockAxios.mockResponse({ data: [mockEventsWithSeats[0]] });

    expect(getByText("Lorum Ipsum 1.")).toBeInTheDocument();
    expect(getByText("Speaker 1")).toBeInTheDocument();
    expect(getByText(/Thu, Aug 15th 2019, 7:00 pm/i)).toBeInTheDocument();
    expect(getByText(/2hr/i)).toBeInTheDocument();
    expect(getByText("Location 1")).toBeInTheDocument();
    expect(getByText("Register")).toBeInTheDocument();
    expect(getByText("Learn More")).toBeInTheDocument();
  });

  it("should display required event details for more than one event", () => {
    const { getByText, getAllByText } = render(<UpcomingEvents />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });

    expect(getByText("Lorum Ipsum 1.")).toBeInTheDocument();
    expect(getByText("Speaker 1")).toBeInTheDocument();
    expect(getByText("Location 1")).toBeInTheDocument();

    expect(getByText("Lorum Ipsum 2.")).toBeInTheDocument();
    expect(getByText("Speaker 2")).toBeInTheDocument();
    expect(getByText("Location 2")).toBeInTheDocument();

    expect(getAllByText(/2hr/i).length).toBe(2);
    expect(getAllByText(/Thu, Aug 15th 2019, 7:00 pm/i).length).toBe(2);

    expect(getByText("Lorum Ipsum 3.")).toBeInTheDocument();
    expect(getByText("Speaker 3")).toBeInTheDocument();

    expect(getByText("Location 3")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum 4.")).toBeInTheDocument();
    expect(getByText("Speaker 4")).toBeInTheDocument();
    expect(getByText("Location 4")).toBeInTheDocument();

    expect(getAllByText(/1.5hr/i).length).toBe(2);
    expect(getAllByText(/Mon, Aug 17th 2020, 6:00 pm/i).length).toBe(2);

    expect(getAllByText("Register").length).toBe(2);
    expect(getAllByText("FULL").length).toBe(2);
    expect(getAllByText("Learn More").length).toBe(4);
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
    const { getByText } = render(<UpcomingEvents />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });

    expect(getByText(/Lorum Ipsum 1/i)).toBeInTheDocument();
    expect(getByText(/Lorum Ipsum 2/i)).toBeInTheDocument();
    expect(getByText(/Lorum Ipsum 3/i)).toBeInTheDocument();
    expect(getByText(/Lorum Ipsum 4/i)).toBeInTheDocument();
  });

  it("should NOT display past events regardless of seat availability", () => {
    mockDate.set("2019-08-16");

    const { getByText, queryByText } = render(<UpcomingEvents />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });

    expect(queryByText(/Lorum Ipsum 1/i)).not.toBeInTheDocument();
    expect(queryByText(/Lorum Ipsum 2/i)).not.toBeInTheDocument();
    expect(getByText(/Lorum Ipsum 3/i)).toBeInTheDocument();
    expect(getByText(/Lorum Ipsum 4/i)).toBeInTheDocument();
  });

  it("should display today's events that are not started regardless of seat availability", () => {
    mockDate.set("2019-08-17T09:59:59Z");

    const { getByText, queryByText } = render(<UpcomingEvents />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });

    expect(queryByText(/Lorum Ipsum 1/i)).not.toBeInTheDocument();
    expect(queryByText(/Lorum Ipsum 2/i)).not.toBeInTheDocument();
    expect(getByText(/Lorum Ipsum 3/i)).toBeInTheDocument();
    expect(getByText(/Lorum Ipsum 4/i)).toBeInTheDocument();
  });

  it("should NOT display today's events that are started regardless of seat availability", () => {
    mockDate.set("2019-08-15T11:01:00Z");

    const { getByText, queryByText } = render(<UpcomingEvents />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    expect(queryByText(/Lorum Ipsum 1/i)).not.toBeInTheDocument();
    expect(queryByText(/Lorum Ipsum 2/i)).not.toBeInTheDocument();
    expect(getByText(/Lorum Ipsum 3/i)).toBeInTheDocument();
    expect(getByText(/Lorum Ipsum 4/i)).toBeInTheDocument();
  });
});

describe("List of Registered and Upcoming Events", () => {
  beforeEach(() => {
    mockDate.set("2019-08-14");
  });
  afterEach(() => {
    mockDate.reset();
    mockAxios.reset();
  });

  it("register button should be differentiated by whether user is registered for the event ", () => {
    const { getAllByText } = render(
      <UpcomingEvents registeredEvents={["5d2edb6e0217642ef2524581"]} />
    );

    mockAxios.mockResponse({ data: mockEventsWithSeats });
    expect(getAllByText("Deregister").length).toBe(1);
    expect(getAllByText("Register").length).toBe(1);
    expect(getAllByText("FULL").length).toBe(2);
  });
});
