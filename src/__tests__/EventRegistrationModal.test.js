import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";

import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import EventRegistrationModal from "../components/EventRegistrationModal";
import EventCard from "../components/EventCard";

describe("registration", () => {
  it("should show success alert when registering is succeessful", () => {
    const { getByText, getByTestId } = render(
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
    const successMsg = getByText("RSVP Successful");
    expect(successMsg).toBeInTheDocument();
  });
});
