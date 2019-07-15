import React from "react";
import ReactDOM from "react-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import UpcomingEvents from "../components/UpcomingEvents";
import mockEvents from "../__mockData__/mockEvents.mockdata";

describe("Upcoming Events", () => {
  it("should show 'Stay tuned' message if there is no upcoming events.", () => {
    const { getByText } = render(<UpcomingEvents upcomingEvents={[]} />);
    expect(getByText("Stay tuned for new events.")).toBeInTheDocument();
  });

  it("should contain the labels for the event summary", () => {
    const { getByText } = render(
      <UpcomingEvents upcomingEvents={[mockEvents[0]]} />
    );
    expect(getByText("What is your Plan B?")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum.")).toBeInTheDocument();
    expect(getByText("By: Michele Ferrario")).toBeInTheDocument();
    expect(getByText("On: Monday, 15 July 2019, 7pm-9pm")).toBeInTheDocument();
    expect(getByText("At: Wework Robinson Rd")).toBeInTheDocument();
    expect(getByText("Register")).toBeInTheDocument();
  });

  it("should display two cards for two events", () => {
    console.log(mockEvents);
    const { getByText, getAllByText } = render(
      <UpcomingEvents upcomingEvents={mockEvents} />
    );

    expect(getByText("What is your Plan B?")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum.")).toBeInTheDocument();
    expect(getByText("By: Michele Ferrario")).toBeInTheDocument();
    expect(getByText("On: Monday, 15 July 2019, 7pm-9pm")).toBeInTheDocument();
    expect(getByText("At: Wework Robinson Rd")).toBeInTheDocument();

    expect(getByText("Investing in ETFs")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum Blah Blah.")).toBeInTheDocument();
    expect(getByText("By: Freddie")).toBeInTheDocument();
    expect(
      getByText("On: Wednesday, 17 July 2019, 7pm-9pm")
    ).toBeInTheDocument();
    expect(getByText("At: Wework Beach Rd")).toBeInTheDocument();

    expect(getAllByText("Register").length).toBe(2);
  });

  it("should show events whose event date is in the future.", () => {
    const spy = jest.spyOn(global, "Date");
    spy.mockImplementationOnce(() => new Date(2019, 7, 16, 12, 0, 0));
    const { getByText, getAllByText } = render(
      <UpcomingEvents upcomingEvents={mockEvents} />
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(getByText("Investing in ETFs")).toBeInTheDocument();
    expect(getByText("Lorum Ipsum Blah Blah.")).toBeInTheDocument();
    expect(getByText("By: Freddie")).toBeInTheDocument();
    expect(
      getByText("On: Wednesday, 17 July 2019, 7pm-9pm")
    ).toBeInTheDocument();
    expect(getByText("At: Wework Beach Rd")).toBeInTheDocument();

    expect(getAllByText("Register").length).toBe(1);
  });
});
