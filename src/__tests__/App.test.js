import React from "react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import MainApp from "../components/App";
import { App } from "../components/App";
import { render, fireEvent, queryByText } from "@testing-library/react";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import mockAxios from "jest-mock-axios";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import mockCourses from "../__mockData__/mockCourses.mockdata";
const mockDate = require("mockdate");

describe("App", () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it("renders the upcoming events component", () => {
    const { getByText } = render(<MainApp />);
    const upcomingEvents = getByText("Upcoming Events");
    expect(upcomingEvents).toBeInTheDocument();
  });
});

describe("render header", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

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
    mockAxios.mockResponse({ data: mockCourses });

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

describe("registering for events", () => {
  it("should prompt user login when user is not logged in if user clicks on Register", () => {
    const { getByTestId, getAllByText } = render(<MainApp />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const registerBtn = getAllByText("Register")[0];
    fireEvent.click(registerBtn);
    const loginModal = getByTestId("login-modal");
    expect(loginModal).toBeInTheDocument();
  });
});

describe("login modal should pop up when user clicks on register on event descriptons page and is not logged in", () => {
  afterEach(() => {
    mockAxios.reset();
  });
});
