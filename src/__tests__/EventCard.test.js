import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import EventCard from "../components/EventCard";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import mockCourses from "../../src/__mockData__/mockCourses.mockdata";
import mockAxios from "jest-mock-axios";
import MainApp from "../components/App";

afterEach(() => {
  window.sessionStorage.clear();
  mockAxios.reset();
  jest.clearAllMocks();
});

describe("Event Card", () => {
  it("should display image", () => {
    const { getByAltText } = render(
      <EventCard eventDetail={mockEventsWithSeats[0]} />
    );

    expect(getByAltText("Event")).toBeInTheDocument();
  });

  it("should display placeholder image if image does not exit", () => {
    const eventWithoutImage = Object.assign({}, mockEventsWithSeats[0]);
    delete eventWithoutImage.image;
    const { getByTestId } = render(
      <EventCard eventDetail={mockEventsWithSeats} />
    );
    expect(getByTestId("event-image")).toHaveAttribute(
      "src",
      "/eventDefault.png"
    );
  });

  it("should display signup modal when signup link is clicked", () => {
    const { getByTestId, getByText } = render(
      <EventCard eventDetail={mockEventsWithSeats} />
    );

    const registerBtn = getByText("Register");
    fireEvent.click(registerBtn);
    const signUpModalBtn = getByText("Sign Up!");
    fireEvent.click(signUpModalBtn);
    const signUpModal = getByTestId("signup-header");
    expect(signUpModal).toBeInTheDocument();
  });
});

describe("registering for events from event card", () => {
  it("should open login box if user is not logged in", () => {
    const { getByText, getByTestId } = render(
      <EventCard eventDetail={mockEventsWithSeats[0]} />
    );
    const registerBtn = getByText("Register");
    const spySessionStorageGetItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "getItem"
    );
    fireEvent.click(registerBtn);
    expect(spySessionStorageGetItem).toHaveBeenCalledTimes(1);
    expect(spySessionStorageGetItem).toHaveBeenCalledWith("JWT");
    const loginModal = getByTestId("login-modal");
    expect(loginModal).toBeInTheDocument();
    spySessionStorageGetItem.mockRestore();
  });

  it("should open event registration box if user is already logged in", async () => {
    const { getByText, getByTestId } = render(
      <EventCard eventDetail={mockEventsWithSeats[0]} />
    );

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
    expect(mockAxios).toHaveBeenCalledTimes(1);

    expect(spySessionStorageGetItem).toHaveBeenCalledTimes(2);
    expect(spySessionStorageGetItem).toHaveBeenCalledWith("JWT");
    const eventRegistrationModal = getByTestId("event-registration-modal");
    const eventTitle = getByText("Event 1");
    const attendeeName = getByText("Sally");
    const eventRegistrationBtn = getByText("RSVP");
    expect(eventRegistrationModal).toBeInTheDocument();
    expect(eventTitle).toBeInTheDocument();
    expect(attendeeName).toBeInTheDocument();
    expect(eventRegistrationBtn).toBeInTheDocument();
  });

  it("should open login box when user is not logged in, and allow user to login", () => {
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
    fireEvent.click(goBtn);
    mockAxios.mockResponse({
      data: {
        name: "John",
        registeredEvents: [],
        jwtToken: mockJwtToken
      }
    });

    mockAxios.mockResponse({
      data: {
        name: "John"
      }
    });

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(goBtn).not.toBeInTheDocument();
    expect(loginModal).not.toBeInTheDocument();
  });

  it("should close event registration modal when registration is confirmed", async () => {
    const { getByText, getByTestId } = render(
      <EventCard eventDetail={mockEventsWithSeats[0]} />
    );

    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    window.sessionStorage.setItem("JWT", mockJwtToken);

    const registerBtn = getByText("Register");
    await fireEvent.click(registerBtn);

    mockAxios.mockResponse({
      data: { name: "Sally" }
    });
    const eventRegistrationBtn = getByText("RSVP");
    const eventRegistrationModal = getByTestId("event-registration-modal");
    fireEvent.click(eventRegistrationBtn);
    expect(getByText("RSVP Successful")).toBeInTheDocument();
    // expect(eventRegistrationModal).not.toBeInTheDocument();
  });

  it("should close event registration modal when Close button is clicked", async () => {
    const { getByText, getByTestId } = render(
      <EventCard eventDetail={mockEventsWithSeats[0]} />
    );

    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    window.sessionStorage.setItem("JWT", mockJwtToken);

    const registerBtn = getByText("Register");
    await fireEvent.click(registerBtn);

    mockAxios.mockResponse({
      data: { name: "Sally" }
    });

    const cancelBtn = getByText("Cancel");
    const eventRegistrationModal = getByTestId("event-registration-modal");
    fireEvent.click(cancelBtn);

    expect(eventRegistrationModal).not.toBeInTheDocument();
  });

  it("should close event registration modal when X is clicked", async () => {
    const { getByText, getByTestId } = render(
      <EventCard eventDetail={mockEventsWithSeats[0]} />
    );

    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    window.sessionStorage.setItem("JWT", mockJwtToken);

    const registerBtn = getByText("Register");
    await fireEvent.click(registerBtn);

    mockAxios.mockResponse({
      data: { name: "Sally" }
    });

    const closeBtn = getByText("×");
    const eventRegistrationModal = getByTestId("event-registration-modal");
    fireEvent.click(closeBtn);

    expect(eventRegistrationModal).not.toBeInTheDocument();
  });
});
