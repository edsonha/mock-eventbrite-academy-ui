import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";
import { App, appHistory } from "../components/App";
import mockCourses from "../__mockData__/mockCourses.mockdata";
import mockAxios from "jest-mock-axios";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
import Dashboard from "../../src/components/Dashboard";
const mockDate = require("mockdate");

const mockHistory = {
  push: jest.fn()
};
const mockJwt = () => {
  const spySessionStorageGetItem = jest.spyOn(
    window.sessionStorage.__proto__,
    "getItem"
  );
  const mockJwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";
  spySessionStorageGetItem.mockReturnValue(mockJwtToken);
};

const renderDashboard = () => {
  const { getByText } = render(<Dashboard history={mockHistory} />);

  return { getByText };
};

describe("Dashboard", () => {
  beforeEach(() => {
    mockDate.set("2019-08-14");
  });

  afterEach(() => {
    mockDate.reset();
    mockAxios.reset();
    appHistory.index = 0;
    jest.clearAllMocks();
  });

  it("should redirect back to the landing page if I am not logged in and try to access the dashboard", () => {
    renderDashboard();

    expect(mockHistory.push).toBeCalledWith("/");
  });

  it("should show loading before jwt resolves", async () => {
    mockJwt();
    const { getByText } = renderDashboard();

    expect(getByText("Loading")).toBeInTheDocument();
  });

  it("should show dashboard if /user/secure resolves sucessfully", () => {
    mockJwt();
    const { getByText } = renderDashboard();

    mockAxios.mockResponse({
      data: ["event"]
    });

    expect(getByText("My Events")).toBeInTheDocument();
  });

  it("should call history.push with root route if axios return 401", () => {
    mockJwt();
    renderDashboard();

    mockAxios.mockError();
    expect(mockHistory.push).toBeCalledWith("/");
  });
});

describe("Registered Events", () => {
  beforeEach(() => {
    mockDate.set("2019-08-14");
  });

  afterEach(() => {
    mockDate.reset();
    mockAxios.reset();
    appHistory.index = 0;
    jest.clearAllMocks();
  });

  it("should show 'No registered events' if user did not register any event", () => {
    mockJwt();
    const { getByText } = renderDashboard();
    mockAxios.mockResponse({
      data: []
    });
    expect(mockAxios).toBeCalledTimes(1);
    expect(getByText("No registered events")).toBeInTheDocument();
  });
});
