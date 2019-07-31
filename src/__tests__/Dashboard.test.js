import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { appHistory } from "../components/App";
import mockAxios from "jest-mock-axios";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import Dashboard from "../../src/components/Dashboard";
const mockDate = require("mockdate");

const mockHistory = {
  push: jest.fn(),
};

const mockJwt = () => {
  const mockJwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

  jest
    .spyOn(window.sessionStorage.__proto__, "getItem")
    .mockReturnValue(mockJwtToken);
};

const renderDashboard = () => {
  const { getByText, getAllByText, queryByText, queryByTestId } = render(
    <Dashboard history={mockHistory} />
  );
  return { getByText, getAllByText, queryByText, queryByTestId };
};

describe("Dashboard", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    appHistory.index = 0;
    mockDate.set("2019-08-14");
  });

  afterEach(() => {
    mockDate.reset();
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it("should redirect back to the landing page if I am not logged in and try to access the dashboard", () => {
    renderDashboard();
    expect(mockHistory.push).toBeCalledWith("/");
  });

  it("should render loading if there is no response", () => {
    mockJwt();
    const { queryByTestId } = renderDashboard();
    expect(queryByTestId("dashboard-events")).toBeInTheDocument();
  });

  it("should show dashboard if /user/secure resolves sucessfully", () => {
    mockJwt();
    const { getByText } = renderDashboard();

    mockAxios.mockResponse({
      data: johnsEvents,
    });

    expect(getByText("Registered Events")).toBeInTheDocument();
  });

  it("should call history.push with root route if axios return 401", () => {
    mockJwt();
    renderDashboard();

    mockAxios.mockError();
    expect(mockHistory.push).toBeCalledWith("/");
  });

  it("should redirect back to landing page if there is an error with the api call", async () => {
    mockJwt();
    renderDashboard();
    mockAxios.mockError();

    const spySessionStorageGetItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "getItem"
    );
    spySessionStorageGetItem.mockReturnValue(null);
    expect(spySessionStorageGetItem()).toBe(null);
    expect(mockHistory.push).toBeCalledWith("/");
  });
});

describe("Registered Events", () => {
  beforeEach(() => {
    mockDate.set("Thu Aug 14 2019 00:00:00 GMT+0800 (Singapore Standard Time)");
  });

  afterEach(() => {
    mockDate.reset();
    mockAxios.reset();
    appHistory.index = 0;
    jest.clearAllMocks();
  });

  it("should show 'No registered events.' if user did not register any event", () => {
    mockJwt();
    const { getByText } = renderDashboard();
    mockAxios.mockResponse({
      data: [],
    });
    expect(mockAxios).toBeCalledTimes(1);
    expect(getByText("No registered events.")).toBeInTheDocument();
  });

  it("should display required event details for all registered event", () => {
    mockJwt();
    const { getByText, getAllByText } = renderDashboard();
    mockAxios.mockResponse({ data: johnsEvents });

    expect(getByText("Speaker 1")).toBeInTheDocument();
    expect(getByText("Speaker 3")).toBeInTheDocument();
    expect(getByText("Speaker 4")).toBeInTheDocument();

    expect(getAllByText("Learn More").length).toBe(3);
    expect(getAllByText("Deregister").length).toBe(3);
  });

  it("should NOT display past registered events", () => {
    mockDate.set("2019-08-16");
    mockJwt();
    const { getByText, queryByText } = renderDashboard();
    mockAxios.mockResponse({ data: johnsEvents });

    expect(queryByText(/Lorum Ipsum 3/i)).not.toBeInTheDocument();
    expect(getByText(/Lorum Ipsum 1/i)).toBeInTheDocument();
    expect(getByText(/Lorum Ipsum 4/i)).toBeInTheDocument();
  });

  it("should redirect to event detail page when 'Learn More' is clicked", async () => {
    mockJwt();
    const { getAllByText } = renderDashboard();
    mockAxios.mockResponse({ data: johnsEvents });
    const learnMoreBtn = getAllByText("Learn More")[0];
    await fireEvent.click(learnMoreBtn);
    expect(mockHistory.push).toBeCalledWith("/event/5d2e7e4bec0f970d68a71466");
  });

  it("should show event 3 1ms before the time of event", () => {
    const event3 = johnsEvents[0];
    const eventTime = new Date(event3.time);
    const beforeEventTime = new Date(eventTime.getTime() - 1);
    mockDate.set(beforeEventTime);

    const { queryByText } = renderDashboard();
    mockAxios.mockResponse({ data: johnsEvents });
    expect(queryByText(/Lorum Ipsum 3/i)).toBeInTheDocument();
  });

  it("should not show event 3 at event time", () => {
    const event3 = johnsEvents[0];
    const eventTime = new Date(event3.time);
    mockDate.set(eventTime);

    const { queryByText } = renderDashboard();
    mockAxios.mockResponse({ data: johnsEvents });
    expect(queryByText(/Lorum Ipsum 3/i)).not.toBeInTheDocument();
  });

  it("should not show event 3 after event time", () => {
    const event3 = johnsEvents[0];
    const eventTime = new Date(event3.time);
    mockDate.set(eventTime);

    const { queryByText } = renderDashboard();
    mockAxios.mockResponse({ data: johnsEvents });
    expect(queryByText(/Lorum Ipsum 3/i)).not.toBeInTheDocument();
  });

  it("should not render Event History Header if there are no history events", () => {
    mockJwt();
    const { queryByText } = renderDashboard();
    mockAxios.mockResponse({ data: johnsEvents });
    expect(queryByText(/Event History /i)).not.toBeInTheDocument();
  });
});

const johnsEvents = [
  {
    _id: "5d2e7e4bec0f970d68a71466",
    title: "Event 3",
    description: "Lorum Ipsum 3.",
    fullDescription: "Full Lorum Ipsum 3.",
    speaker: "Speaker 3",
    speakerBio: "Speaker Bio 3",
    time: "2019-08-15T18:00:00+08:00",
    duration: 90,
    location: "Location 3",
    availableSeats: 100,
    image: "https://via.placeholder.com/150.png?text=_",
  },
  {
    _id: "5d2e798c8c4c740d685e1d3f",
    title: "Event 1",
    description: "Lorum Ipsum 1.",
    fullDescription: "Full Lorum Ipsum 1.",
    speaker: "Speaker 1",
    speakerBio: "Speaker Bio 1",
    time: "2019-08-17T19:00:00+08:00",
    duration: 120,
    location: "Location 1",
    availableSeats: 100,
    image: "https://via.placeholder.com/150.png?text=_",
  },
  {
    _id: "5d2e7dd7ec0f970d68a71464",
    title: "Event 4",
    description: "Lorum Ipsum 4.",
    fullDescription: "Full Lorum Ipsum 4.",
    speaker: "Speaker 4",
    speakerBio: "Speaker Bio 4",
    time: "2019-08-19T19:00:00+08:00",
    duration: 90,
    location: "Location 4",
    availableSeats: 0,
    image: "https://via.placeholder.com/150.png?text=_",
  },
];
