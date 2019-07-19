import React from "react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { App } from "../components/App";
import { render, fireEvent } from "@testing-library/react";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import mockAxios from "jest-mock-axios";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import EventDescriptionPage from "../components/EventDescriptionPage";
const mockDate = require("mockdate");

describe("Event Description Page", () => {
  beforeEach(() => {
    mockDate.set("2019-08-14");
  });
  afterEach(() => {
    mockDate.reset();
    mockAxios.reset();
  });

  it("should navigate to the Event Description page when I click on the image in the card", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });

    const { queryAllByTestId, getByTestId } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    mockAxios.mockResponse({ data: mockEventsWithSeats });

    const eventCards = queryAllByTestId("event-image");
    fireEvent.click(eventCards[0]);
    expect(getByTestId("event-description-page")).toBeInTheDocument();
  });

  it("should navigate to the Event Description page when I click Learn more in the card", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });

    const { queryAllByTestId, getByTestId } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    mockAxios.mockResponse({ data: mockEventsWithSeats });

    const eventCards = queryAllByTestId("event-learnmore");
    fireEvent.click(eventCards[0]);
    expect(getByTestId("event-description-page")).toBeInTheDocument();
  });

  it("should show the event title on the Event Description page", () => {
    const { getAllByText } = render(
      <EventDescriptionPage
        backendURI={"dummy"}
        eventId={"5d2edb6e0217642ef2524582"}
      />
    );
    mockAxios.mockResponse({ data: mockEventsWithSeats[1] });
    expect(getAllByText(/event 2/i).length).toBeGreaterThan(0);
  });

  it("should show 'Try again' message if there is an error with the api call", () => {
    const { getByText } = render(
      <EventDescriptionPage
        backendURI={"dummy"}
        eventId={"5d2edb6e0217642ef2524582"}
      />
    );
    mockAxios.mockError();

    expect(mockAxios.get).toHaveBeenCalledWith(
      "dummy/upcomingevents/5d2edb6e0217642ef2524582"
    );
    expect(
      getByText("Oops, something went wrong. Please try again later")
    ).toBeInTheDocument();
  });
});
