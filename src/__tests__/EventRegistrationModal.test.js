import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";

import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import EventCard from "../components/EventCard";
import mockAxios from "jest-mock-axios";

describe("registration", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should show success alert when registering is succeessful", () => {
    const { getByText } = render(
      <EventCard eventDetail={mockEventsWithSeats[0]} />
    );
    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    window.sessionStorage.setItem("JWT", mockJwtToken);
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
    const { getByText, queryAllByText } = render(
      <EventCard eventDetail={mockEventsWithSeats[1]} />
    );
    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    window.sessionStorage.setItem("JWT", mockJwtToken);
    const registerBtn = getByText("Register");
    fireEvent.click(registerBtn);
    expect(queryAllByText("Event 2")).toHaveLength(2);
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
    const { getByText, queryAllByText } = render(
      <EventCard eventDetail={mockEventsWithSeats[1]} />
    );
    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    window.sessionStorage.setItem("JWT", mockJwtToken);
    const registerBtn = getByText("Register");
    fireEvent.click(registerBtn);
    expect(queryAllByText("Event 2")).toHaveLength(2);
    const rsvpBtn = getByText("RSVP");
    expect(rsvpBtn).toBeInTheDocument();
    fireEvent.click(rsvpBtn);
    mockAxios.mockError();

    const failureMsg = getByText("Please try again");
    expect(failureMsg).toBeInTheDocument();
  });
});
