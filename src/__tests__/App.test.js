import React from "react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { App } from "../components/App";
import { render, fireEvent } from "@testing-library/react";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import mockAxios from "jest-mock-axios";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
const mockDate = require("mockdate");

describe("App", () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it("renders the upcoming events component", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });

    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    const upcomingEvents = getByText("Upcoming Events");
    expect(upcomingEvents).toBeInTheDocument();
  });
});

describe("render header", () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it("should render header", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const { getByTestId } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    expect(getByTestId("app-header")).toBeInTheDocument();
  });
});

describe("routing of the stashaway icon header to the landing page", () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it("routing of the stashaway icon header to the landing page", () => {
    const history = createMemoryHistory({
      initialEntries: ["/event/5d2edb6e0217642ef2524581"]
    });

    const { getByTestId, getByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    const stashawayLogo = getByTestId("logo-svg");
    fireEvent.click(stashawayLogo);
    expect(getByText("Upcoming Events")).toBeInTheDocument();
  });
});

describe("routing for event description page", () => {
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
});
