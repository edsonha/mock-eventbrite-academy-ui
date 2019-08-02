import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";

import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import EventCard from "../components/EventCard";
import mockAxios from "jest-mock-axios";
import EventRegistrationModal from "../components/EventRegistrationModal";

const mockJwt = () => {
  const mockJwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

  jest
    .spyOn(window.sessionStorage.__proto__, "getItem")
    .mockReturnValue(mockJwtToken);
};

const mockHistory = {
  push: jest.fn()
};
const placeholderEvent = {
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
};
const mockShowEventRegistrationModal = jest.fn();
const mockUpdateRegisteredEvents = jest.fn();
const renderEventRegistrationModal = () => {
  const { getByText, getAllByText } = render(
    <EventRegistrationModal
      isOpen={true}
      eventDetail={placeholderEvent}
      showEventRegistrationModal={mockShowEventRegistrationModal}
      updateRegisteredEvents={mockUpdateRegisteredEvents}
      history={mockHistory}
    />
  );
  return { getByText, getAllByText };
};

afterEach(() => {
  mockAxios.reset();
  jest.clearAllMocks();
  window.sessionStorage.clear();
});

describe("Starting UI", () => {
  it("should display UI elements", async () => {
    mockJwt();
    const { getByText } = await renderEventRegistrationModal();
    mockAxios.mockResponse({ data: { name: "John Wick" } });

    const eventTitle = getByText("Event 3");
    const eventDateTime = getByText("Thu, Aug 15th 2019, 6:00 pm (1.5hr)");
    const eventLocation = getByText("Location 3");
    const username = getByText("John Wick");
    const closeBtn = getByText("×");
    const cancelBtn = getByText("Cancel");
    const rsvp = getByText("RSVP");

    expect(mockAxios).toHaveBeenCalledTimes(1);
    expect(eventTitle).toBeInTheDocument();
    expect(eventDateTime).toBeInTheDocument();
    expect(eventLocation).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(closeBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
    expect(rsvp).toBeInTheDocument();
  });
});

describe("Closing of modal", () => {
  it("should close event registration modal when x button is clicked", () => {
    const { getByText } = renderEventRegistrationModal();
    fireEvent.click(getByText("×"));
    expect(mockShowEventRegistrationModal).toHaveBeenCalledTimes(1);
  });

  it("should close event registration modal when Cancel button is clicked", () => {
    const { getByText } = renderEventRegistrationModal();
    fireEvent.click(getByText("Cancel"));
    expect(mockShowEventRegistrationModal).toHaveBeenCalledTimes(1);
  });
});

describe("Register functionality", () => {
  it("should show 'RSVP Successful' if event registration is successful", async () => {
    mockJwt();
    const { getByText } = await renderEventRegistrationModal();
    mockAxios.mockResponse({ data: { name: "John Wick" } });

    const rsvpBtn = getByText("RSVP");
    fireEvent.click(rsvpBtn);

    mockAxios.mockResponse();
    mockAxios.mockResponse();
    expect(getByText("RSVP Successful")).toBeInTheDocument();
    expect(mockUpdateRegisteredEvents).toHaveBeenCalledTimes(1);
  });

  it("should show 'Event is full' if registration is rejected due to no available seat (status: 422)", async () => {
    mockJwt();
    const { getByText } = await renderEventRegistrationModal();
    mockAxios.mockResponse({ data: { name: "John Wick" } });

    const rsvpBtn = getByText("RSVP");
    fireEvent.click(rsvpBtn);

    mockAxios.mockError({ response: { status: 422 } });

    expect(getByText("Event is full")).toBeInTheDocument();
  });
});

describe("Catching error on axios", () => {
  it("should remove JWT and redirect to landing page if axios return 401", async () => {
    mockJwt();
    await renderEventRegistrationModal();
    const spySessionStorageRemoveItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "removeItem"
    );
    mockAxios.mockError({ request: { status: 401 } });
    expect(mockHistory.push).toBeCalledWith("/");
    expect(spySessionStorageRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe("registration", () => {
  it("should show success alert when registering is succeessful", () => {
    mockJwt();
    const { getByText } = render(
      <EventCard eventDetail={mockEventsWithSeats[0]} />
    );
    const registerBtn = getByText("Register");
    fireEvent.click(registerBtn);
    expect(getByText("Event 1")).toBeInTheDocument();
    const rsvpBtn = getByText("RSVP");
    expect(rsvpBtn).toBeInTheDocument();
    fireEvent.click(rsvpBtn);
    mockAxios.mockResponse({
      data: []
    });

    const successMsg = getByText("RSVP Successful");
    expect(successMsg).toBeInTheDocument();
  });

  it("should show `Event is Full` alert when there is no more available seat", () => {
    mockJwt();
    const { getByText } = render(
      <EventCard eventDetail={mockEventsWithSeats[0]} />
    );
    const registerBtn = getByText("Register");
    fireEvent.click(registerBtn);
    const rsvpBtn = getByText("RSVP");
    expect(rsvpBtn).toBeInTheDocument();
    fireEvent.click(rsvpBtn);
    mockAxios.mockError({
      response: { status: 422 }
    });

    const failureMsg = getByText("Event is full");
    expect(failureMsg).toBeInTheDocument();
  });

  it("should show `Please try again` alert when there is an error with the register back end call", () => {
    mockJwt();
    const { getByText } = render(
      <EventCard eventDetail={mockEventsWithSeats[0]} />
    );
    const registerBtn = getByText("Register");
    fireEvent.click(registerBtn);
    const rsvpBtn = getByText("RSVP");
    expect(rsvpBtn).toBeInTheDocument();
    fireEvent.click(rsvpBtn);
    mockAxios.mockError();

    const failureMsg = getByText("Please try again");
    expect(failureMsg).toBeInTheDocument();
  });
});
