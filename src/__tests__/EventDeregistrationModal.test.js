import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import EventDeregistrationModal from "../components/EventDeregistrationModal";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import mockAxios from "jest-mock-axios";

describe("deregistration", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should show `You have been deregistered from this Event` when deregistration is successful ", () => {
    const { getByText } = render(
      <EventDeregistrationModal
        isOpen={true}
        eventDetail={mockEventsWithSeats[0]}
      />
    );

    const yesBtn = getByText("Yes");
    fireEvent.click(yesBtn);

    mockAxios.mockResponse({
      data: []
    });

    const deregistrationMessage = getByText(
      "You have been deregistered from this Event"
    );
    expect(deregistrationMessage).toBeInTheDocument();
  });

  it("should ask user to try again if unable to deregister succesfully", async () => {
    const { getByText } = render(
      <EventDeregistrationModal
        isOpen={true}
        eventDetail={mockEventsWithSeats[0]}
      />
    );

    const yesBtn = getByText("Yes");
    fireEvent.click(yesBtn);

    mockAxios.mockError();
    const deregistrationMessage = getByText("Please try again");
    expect(deregistrationMessage).toBeInTheDocument();
  });
});
