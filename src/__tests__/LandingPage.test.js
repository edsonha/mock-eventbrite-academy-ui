import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import LandingPage from "../components/LandingPage";
import mockAxios from "jest-mock-axios";
import mockEvents from "../__mockData__/mockEventsWithSeats.mockdata";
import mockCourses from "../__mockData__/mockCourses.mockdata";

const backendURI = "dummy";

describe("ui", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should show landing page header when landing page is rendered", () => {
    const { getByText } = render(<LandingPage backendURI={backendURI} />);
    expect(
      getByText("Personal Finance Course on Your Terms")
    ).toBeInTheDocument();
  });

  it("should show landing page header when landing page is rendered", () => {
    const { getByTestId } = render(<LandingPage backendURI={backendURI} />);
    expect(getByTestId("upcoming-events")).toBeInTheDocument();
  });

  it("should show stashaway curriculum", () => {
    const { getByText } = render(<LandingPage backendURI={backendURI} />);

    expect(getByText("Stashaway Academy Curriculum")).toBeInTheDocument();
  });

  it("should display four levels of courses", () => {
    const { getAllByText } = render(<LandingPage backendURI={backendURI} />);
    mockAxios.mockResponse({ data: mockEvents });
    mockAxios.mockResponse({ data: mockCourses });
    expect(getAllByText(/Basic/i).length).toBe(3);
    expect(getAllByText(/Intermediate/i).length).toBe(2);
    expect(getAllByText(/Advanced/i).length).toBe(2);
    expect(getAllByText(/Electives/i).length).toBe(1);
  });

  it("should display button to see upcoming events", () => {
    const { getAllByText } = render(<LandingPage backendURI={backendURI} />);
    mockAxios.mockResponse({ data: mockEvents });
    mockAxios.mockResponse({ data: mockCourses });
    expect(getAllByText("See All Upcoming Events").length).toBe(4);
  });

  it("should display Stashaway courses in detail", () => {
    const { getByText } = render(<LandingPage backendURI={backendURI} />);
    mockAxios.mockResponse({ data: mockEvents });
    mockAxios.mockResponse({ data: mockCourses });

    expect(mockAxios.get).toHaveBeenCalledTimes(2);
    expect(getByText("Financial Planning Basics")).toBeInTheDocument();
    expect(getByText("Investing Basics")).toBeInTheDocument();
    expect(getByText("Advanced investing")).toBeInTheDocument();
    expect(getByText("StashAway: An Inside Look")).toBeInTheDocument();
    expect(getByText("What's Your Financial Plan B?")).toBeInTheDocument();
    expect(getByText("How to Plan for Your Retirement?")).toBeInTheDocument();
    expect(
      getByText("How to Start a Business...That Lasts")
    ).toBeInTheDocument();
    expect(getByText("StashAway: An Inside Look")).toBeInTheDocument();
  });

  it("should display something went wrong if api call fails", () => {
    const { getByText } = render(<LandingPage backendURI={backendURI} />);
    mockAxios.mockResponse({ data: mockEvents });
    mockAxios.mockError();

    expect(
      getByText("Could not find courses. Please try again later")
    ).toBeInTheDocument();
  });
});
