import React from "react";
import { render, fireEvent, queryByText } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { App, appHistory } from "../components/App";
import MainApp from "../components/App";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";
import mockCourses from "../__mockData__/mockCourses.mockdata";
import mockAxios from "jest-mock-axios";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";
const mockDate = require("mockdate");

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
    const history = createMemoryHistory({
      initialEntries: ["/dashboard"]
    });

    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    expect(
      getByText("Personal Finance Courses on Your Terms")
    ).toBeInTheDocument();
  });

  // it.only("should redirect user from landing page to dashboard if user log-in", async done => {
  //   const history = createMemoryHistory({
  //     initialEntries: ["/"]
  //   });

  //   const { getByText, getAllByText, getByPlaceholderText } = render(
  //     <Router history={history}>
  //       <App />
  //     </Router>
  //   );

  //   console.log("1*****");
  //   mockAxios.mockResponse({ data: mockEventsWithSeats });
  //   console.log("2*****");
  //   mockAxios.mockResponse({ data: mockCourses });
  //   console.log("3*****");
  //   const spySessionStorageGetItem = jest.spyOn(
  //     window.sessionStorage.__proto__,
  //     "getItem"
  //   );

  //   const headerLoginBtn = getAllByText("Log In")[0];
  //   fireEvent.click(headerLoginBtn);
  //   const goBtn = getByText("Go!");
  //   const emailInput = getByPlaceholderText("myemail@email.com");
  //   const passwordInput = getByPlaceholderText("********");
  //   fireEvent.change(emailInput, { target: { value: "john@gmail.com" } });
  //   fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });
  //   fireEvent.click(goBtn);
  //   const mockJwtToken =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";
  //   spySessionStorageGetItem.mockReturnValue(mockJwtToken);

  //   mockAxios.mockResponse({
  //     data: { name: "John Wick", email: "john@gmail.com" }
  //   });

  //   await process.nextTick(() => {});
  //   expect(mockAxios.get).toHaveBeenCalledTimes(2);
  //   expect(mockAxios.post).toHaveBeenCalledTimes(1);
  //   expect(getByText("Loading")).toBeInTheDocument();
  //   done();
  // });

  it("should NOT redirect user to dashboard if user log-in from pages other than landing page", () => {
    appHistory.push("/event/5d2edb6e0217642ef2524581");
    const {
      getByText,
      getAllByText,
      getByPlaceholderText,
      queryByText
    } = render(
      <Router history={appHistory}>
        <App />
      </Router>
    );
    mockAxios.mockResponse({ data: mockCourses[0] });

    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    const headerLoginBtn = getAllByText("Log In")[0];
    fireEvent.click(headerLoginBtn);
    const goBtn = getByText("Go!");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "john@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });
    fireEvent.click(goBtn);

    mockAxios.mockResponse({
      status: 200,
      data: { name: "John Wick", email: "john@gmail.com" }
    });

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(queryByText("Dashboard")).not.toBeInTheDocument();
  });
});
