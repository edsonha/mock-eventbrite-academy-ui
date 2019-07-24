import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import Course from "../components/Course";
import mockCourses from "../__mockData__/mockCourses.mockdata";

describe("ui of Course", () => {
  it("should show course header when course is rendered", () => {
    const { getByText } = render(<Course details={mockCourses[0]} />);
    expect(getByText("Financial Planning Basics")).toBeInTheDocument();
  });

  it("should show course description when course is rendered", () => {
    const { getByText } = render(<Course details={mockCourses[0]} />);
    expect(getByText("Lorum Ipsum.")).toBeInTheDocument();
  });

  it("should show course objective header when course is rendered", () => {
    const { getByText } = render(<Course details={mockCourses[0]} />);
    expect(getByText("Objective")).toBeInTheDocument();
  });

  it("should show the list of objectives when course is rendered", () => {
    const { getByText } = render(<Course details={mockCourses[0]} />);
    expect(getByText("Obj 1")).toBeInTheDocument();
  });
});

