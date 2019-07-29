import React from "react";
import { render, fireEvent } from "@testing-library/react";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import mockAxios from "jest-mock-axios";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import EventDescriptionPage from "../components/EventDescriptionPage";
import MainApp from "../components/App";
import mockCourses from "../__mockData__/mockCourses.mockdata";
const mockDate = require("mockdate");

describe("Event Description Page", () => {
  beforeEach(() => {
    mockDate.set("2019-08-14");
  });
  afterEach(() => {
    mockDate.reset();
    mockAxios.reset();
  });

  it("should show the event description on the Event Description page", () => {
    const { getAllByText } = render(
      <EventDescriptionPage
        backendURI={"dummy"}
        eventId={"5d2edb6e0217642ef2524582"}
      />
    );
    mockAxios.mockResponse({ data: mockEventsWithSeats[1] });
    expect(getAllByText(/Lorum Ipsum 2./i).length).toBeGreaterThan(0);
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

  it("should show placeholder image with title if event has no image", () => {
    const { getByText } = render(
      <EventDescriptionPage
        backendURI={"dummy"}
        eventId={"5d2edb6e0217642ef2524582"}
      />
    );
    mockAxios.mockResponse({ data: mockEventsWithSeats[1] });
    expect(getByText(/Event 2/i)).toBeInTheDocument();
  });

  it("should display signup modal when signup link is clicked", () => {
    const { getByTestId, getByText } = render(
      <EventDescriptionPage
        backendURI={"dummy"}
        eventId={"5d2edb6e0217642ef2524582"}
      />
    );

    mockAxios.mockResponse({ data: mockEventsWithSeats[1] });

    const registerBtn = getByText("Register");
    fireEvent.click(registerBtn);
    const signUpModalBtn = getByText("Sign Up!");
    fireEvent.click(signUpModalBtn);
    const signUpModal = getByTestId("signup-header");
    expect(signUpModal).toBeInTheDocument();
  });

  it("should open login box when user is not logged in, and allow user to login", async () => {
    const { getByText, getByTestId, getAllByText } = render(<MainApp />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    const registerBtn = getAllByText("Register")[0];
    fireEvent.click(registerBtn);

    const loginModal = getByTestId("login-modal");
    expect(loginModal).toBeInTheDocument();
    const goBtn = getByText("Go!");
    await fireEvent.click(goBtn);
    mockAxios.mockResponse({
      data: {
        name: "Sally",
        registeredEvents: [],
        jwtToken: mockJwtToken
      }
    });

    mockAxios.mockResponse({
      data: {
        name: "Sally"
      }
    });

    const logOutBtn = getByText("Log Out");
    const welcomeMessage = getByText("S");
    expect(welcomeMessage).toBeInTheDocument();
    expect(logOutBtn).toBeInTheDocument();
  });

  it("should open event registration box if user is already logged in", async () => {
    const { getByText, getByTestId, getAllByText } = render(
      <EventDescriptionPage
        backendURI={"dummy"}
        eventId={"5d2edb6e0217642ef2524582"}
      />
    );

    mockAxios.mockResponse({ data: mockEventsWithSeats[1] });
    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    window.sessionStorage.setItem("JWT", mockJwtToken);

    const registerBtn = getByText("Register");
    const spySessionStorageGetItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "getItem"
    );
    await fireEvent.click(registerBtn);

    mockAxios.mockResponse({
      data: { name: "Sally" }
    });
    // expect(mockAxios).toHaveBeenCalledTimes(1);

    expect(spySessionStorageGetItem).toHaveBeenCalledWith("JWT");
    const eventRegistrationModal = getByTestId("event-registration-modal");
    const eventTitle = getAllByText("Event 2")[1];
    const attendeeName = getByText("Sally");
    const eventRegistrationBtn = getByText("RSVP");
    expect(eventRegistrationModal).toBeInTheDocument();
    expect(eventTitle).toBeInTheDocument();
    expect(attendeeName).toBeInTheDocument();
    expect(eventRegistrationBtn).toBeInTheDocument();
  });
});
