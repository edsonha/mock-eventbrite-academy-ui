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

  it("login modal should pop up when user clicks on register on event descriptons page and is not logged in", () => {
    const history = createMemoryHistory({
      initialEntries: ["/event/5d2edb6e0217642ef2524581"]
    });

    const { getByTestId } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    mockAxios.mockResponse({ data: mockEventsWithSeats });

    fireEvent.click(getByTestId("register-button"));
    expect(getByTestId("login-modal")).toBeInTheDocument();
  });

  describe("app should get registered events when user is logged in", () => {
    afterEach(() => {
      mockAxios.reset();
    });

    it("should get registered events when app is called and user is logged in", () => {
      const history = createMemoryHistory({ initialEntries: ["/"] });
      const mockJwtToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

      window.sessionStorage.setItem("JWT", mockJwtToken);

      const { queryAllByText } = render(
        <Router history={history}>
          <App />
        </Router>
      );
      mockAxios.mockResponse({ data: { name: "john" } });
      mockAxios.mockResponse({ data: mockEventsWithSeats });
      mockAxios.mockResponse({ data: mockCourses });
      mockAxios.mockResponse({ data: johnsEvents });

      expect(queryAllByText("Deregister")).toHaveLength(1);
    });
  });
});

const johnsEvents = [
  {
    _id: "5d2edb6e0217642ef2524583",
    title: "Event 3",
    description: "Lorum Ipsum 3.",
    fullDescription: "Full Lorum Ipsum 3.",
    speaker: "Speaker 3",
    speakerBio: "Speaker Bio 3",
    time: "2019-08-15T18:00:00+08:00",
    duration: 90,
    location: "Location 3",
    availableSeats: 100,
    image: "https://via.placeholder.com/150.png?text=_"
  }
];
