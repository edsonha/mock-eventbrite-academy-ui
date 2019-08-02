import React from "react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import MainApp from "../components/App";
import { App } from "../components/App";
import {
  render,
  fireEvent,
} from "@testing-library/react";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import mockAxios from "jest-mock-axios";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import mockCourses from "../__mockData__/mockCourses.mockdata";
const mockDate = require("mockdate");

const mockJwt = () => {
  const mockJwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

  jest
    .spyOn(window.sessionStorage.__proto__, "getItem")
    .mockReturnValue(mockJwtToken);
};

beforeEach(() => {
  mockDate.set("2019-08-14");
});
afterEach(() => {
  window.sessionStorage.clear();
  mockAxios.reset();
  mockDate.reset();
  jest.clearAllMocks();
});

describe("App", () => {
  it("renders the upcoming events component", () => {
    const { getByText } = render(<MainApp />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });
    const upcomingEvents = getByText("Upcoming Events");
    expect(upcomingEvents).toBeInTheDocument();
  });
  it("should call axios for user's registered events if user is logged in", () => {
    mockJwt();
    const history = createMemoryHistory({ initialEntries: ["/"] });
    render(
      <Router history={history}>
        <App />
      </Router>
    );
    mockAxios.mockResponse({ data: { name: "John Wick " } });
    mockAxios.mockResponse({ data: [] });

    expect(mockAxios.get).toHaveBeenCalled();
  });
});

describe("render header", () => {
  it("should render header", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const { getByTestId } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    expect(getByTestId("app-header")).toBeInTheDocument();
  });
});

describe("routing for event description page", () => {
  it("should navigate to the Event Description page when I click on the image in the card", () => {
    mockJwt();
    const { getAllByTestId, getByTestId } = render(<MainApp />);
    mockAxios.mockResponse({ data: "John Wick" });
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const eventCards = getAllByTestId("event-image");
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
    mockAxios.mockResponse({ data: { name: "John Wick" } });

    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const eventCards = queryAllByTestId("event-learnmore");
    fireEvent.click(eventCards[0]);
    expect(getByTestId("event-description-page")).toBeInTheDocument();
  });
});

describe("Routing to dashboard", () => {
  
  it("should render Dashboard", ()=>{
    mockJwt();
    const history = createMemoryHistory({ initialEntries: ["/dashboard"] });

    const { getByTestId } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    expect(getByTestId("registeredEventsSection")).toBeInTheDocument();
    expect(getByTestId("historyEventsSection")).toBeInTheDocument();
  })
});
