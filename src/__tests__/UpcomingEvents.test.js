import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import UpcomingEvents from "../components/UpcomingEvents";
import mockEvents from "../__mockData__/mockEvents.mockdata";
const mockDate = require("mockdate");

describe("Upcoming Events", () => {
  beforeEach(() => {
    mockDate.set("2019-08-14");
  });
  afterEach(() => {
    mockDate.reset();
  });

  it("should show 'Stay tuned' message if there is no upcoming events.", () => {
    const { getByText } = render(<UpcomingEvents upcomingEvents={[]} />);
    expect(getByText("Stay tuned for new events.")).toBeInTheDocument();
  });

  it("should display one card for one event", () => {
    const { getByText } = render(
      <UpcomingEvents upcomingEvents={[mockEvents[0]]} />
    );

    expect(getByText("What is your Plan B?")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum.")).toBeInTheDocument();
    expect(getByText("By: Michele Ferrario")).toBeInTheDocument();
    expect(
      getByText("On: Thursday, August 15th 2019, 7:00 pm")
    ).toBeInTheDocument();
    expect(getByText("Duration: 2hr")).toBeInTheDocument();
    expect(getByText("At: WeWork Robinson Rd")).toBeInTheDocument();
    expect(getByText("Register")).toBeInTheDocument();
  });

  it("should display two cards for two events", () => {
    const { getByText, getAllByText } = render(
      <UpcomingEvents upcomingEvents={mockEvents} />
    );

    expect(getByText("What is your Plan B?")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum.")).toBeInTheDocument();
    expect(getByText("By: Michele Ferrario")).toBeInTheDocument();
    expect(
      getByText("On: Thursday, August 15th 2019, 7:00 pm")
    ).toBeInTheDocument();
    expect(getByText("Duration: 2hr")).toBeInTheDocument();
    expect(getByText("At: WeWork Robinson Rd")).toBeInTheDocument();

    expect(getByText("Investing in ETFs")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum Blah Blah.")).toBeInTheDocument();
    expect(getByText("By: Freddie")).toBeInTheDocument();
    expect(
      getByText("On: Saturday, August 17th 2019, 6:00 pm")
    ).toBeInTheDocument();
    expect(getByText("Duration: 1.5hr")).toBeInTheDocument();
    expect(getByText("At: WeWork Beach Rd")).toBeInTheDocument();

    expect(getAllByText("Register").length).toBe(2);
  });

  it("should show events whose event date is in the future.", () => {
    mockDate.set("2019-08-16");

    const { getByText, getAllByText, queryByText } = render(
      <UpcomingEvents upcomingEvents={mockEvents} />
    );
    expect(queryByText("What is your Plan B?")).not.toBeInTheDocument();
    expect(queryByText("Lorum Ipsum.")).not.toBeInTheDocument();
    expect(queryByText("By: Michele Ferrario")).not.toBeInTheDocument();
    expect(
      queryByText("On: Thursday, August 15th 2019, 7:00 pm")
    ).not.toBeInTheDocument();
    expect(queryByText("Duration: 2hr")).not.toBeInTheDocument();
    expect(queryByText("At: WeWork Robinson Rd")).not.toBeInTheDocument();

    expect(getByText("Investing in ETFs")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum Blah Blah.")).toBeInTheDocument();
    expect(getByText("By: Freddie")).toBeInTheDocument();
    expect(
      getByText("On: Saturday, August 17th 2019, 6:00 pm")
    ).toBeInTheDocument();
    expect(getByText("At: WeWork Beach Rd")).toBeInTheDocument();

    expect(getAllByText("Register").length).toBe(1);
  });

  it("should show events whose event date is in the current day but the current time is before event time", () => {
    mockDate.set("2019-08-17T09:59:59Z");

    const { getByText, getAllByText, queryByText } = render(
      <UpcomingEvents upcomingEvents={mockEvents} />
    );
    expect(queryByText("What is your Plan B?")).not.toBeInTheDocument();
    expect(queryByText("Lorum Ipsum.")).not.toBeInTheDocument();
    expect(queryByText("By: Michele Ferrario")).not.toBeInTheDocument();
    expect(
      queryByText("On: Thursday, August 15th 2019, 7:00 pm")
    ).not.toBeInTheDocument();
    expect(queryByText("Duration: 2hr")).not.toBeInTheDocument();
    expect(queryByText("At: WeWork Robinson Rd")).not.toBeInTheDocument();

    expect(getByText("Investing in ETFs")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum Blah Blah.")).toBeInTheDocument();
    expect(getByText("By: Freddie")).toBeInTheDocument();
    expect(
      getByText("On: Saturday, August 17th 2019, 6:00 pm")
    ).toBeInTheDocument();
    expect(getByText("At: WeWork Beach Rd")).toBeInTheDocument();

    expect(getAllByText("Register").length).toBe(1);
  });

  it("should not show events whose event date is in the same day and the current time is after the event time", () => {
    mockDate.set("2019-08-15T11:00:01Z");

    const { getByText, getAllByText, queryByText } = render(
      <UpcomingEvents upcomingEvents={mockEvents} />
    );

    expect(queryByText("What is your Plan B?")).not.toBeInTheDocument();
    expect(queryByText("Lorum Ipsum.")).not.toBeInTheDocument();
    expect(queryByText("By: Michele Ferrario")).not.toBeInTheDocument();
    expect(
      queryByText("On: Thursday, August 15th 2019, 7:00 pm")
    ).not.toBeInTheDocument();
    expect(queryByText("Duration: 2hr")).not.toBeInTheDocument();
    expect(queryByText("At: WeWork Robinson Rd")).not.toBeInTheDocument();

    expect(getByText("Investing in ETFs")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum Blah Blah.")).toBeInTheDocument();
    expect(getByText("By: Freddie")).toBeInTheDocument();
    expect(
      getByText("On: Saturday, August 17th 2019, 6:00 pm")
    ).toBeInTheDocument();
    expect(getByText("At: WeWork Beach Rd")).toBeInTheDocument();

    expect(getAllByText("Register").length).toBe(1);
  });
});
