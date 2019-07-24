import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import CourseWrapper from "../components/CourseWrapper";
import mockCourses from "../__mockData__/mockCourses.mockdata";

describe("render courses", () => {
  it("should show basic courses when basic courses are inputted", () => {
    const { getByText } = render(
      <CourseWrapper level="basic" courses={mockCourses} />
    );
    const basicCourse1 = getByText("Financial Planning Basics");
    expect(basicCourse1).toBeInTheDocument();
    const basicCourse2 = getByText("Investing Basics");
    expect(basicCourse2).toBeInTheDocument();
  });

  it("should show intermediate courses when intermediate courses are inputted", () => {
    const { getByText } = render(
      <CourseWrapper level="intermediate" courses={mockCourses} />
    );
    const intermediateCourse1 = getByText("What's Your Financial Plan B?");
    expect(intermediateCourse1).toBeInTheDocument();
    const intermediateCourse2 = getByText("How to Plan for Your Retirement?");
    expect(intermediateCourse2).toBeInTheDocument();
  });
});
