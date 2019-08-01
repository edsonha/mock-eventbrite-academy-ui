import React from "react";
import Header from "../components/Header";
import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import mockAxios from "jest-mock-axios";

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

const renderHeader = () => {
  const { getByText, getAllByText, queryByText, getByTestId } = render(
    <Header history={mockHistory} />
  );
  return { getByText, getAllByText, queryByText, getByTestId };
};

describe("header UI", () => {
  afterEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });
  it("should show Stashaway logo, Login and Sign Up buttons when user is not logged in", () => {
    const { getByText, getByTestId } = renderHeader();
    const loginBtn = getByText("Log In");
    const signUpBtn = getByText("Sign Up");
    const logo = getByTestId("logo-svg");
    expect(loginBtn).toBeInTheDocument();
    expect(signUpBtn).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
  });

  it("should show username initial, logout button, and My Events link when user is logged in", () => {
    mockJwt();
    const { getByText } = renderHeader();

    mockAxios.mockResponse({
      data: { name: "John Wick" }
    });

    const userInitials = getByText("JW");
    const logOutBtn = getByText("Log Out");
    const myEventsLink = getByText("My Events");

    expect(userInitials).toBeInTheDocument();
    expect(logOutBtn).toBeInTheDocument();
    expect(myEventsLink).toBeInTheDocument();
  });

  it("should open up login modal when log in button is clicked", () => {
    const { getByText, getByTestId } = renderHeader();
    const loginBtn = getByText("Log In");
    fireEvent.click(loginBtn);
    expect(getByTestId("login-modal")).toBeInTheDocument();
  });

  it("should open up signup modal when sign up button is clicked", () => {
    const { getByText, getByTestId } = renderHeader();
    const signupBtn = getByText("Sign Up");
    fireEvent.click(signupBtn);
    expect(getByTestId("signup-header")).toBeInTheDocument();
  });
});

describe("routing", () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it("should redirect to landing page after Stashaway icon is clicked", () => {
    const { getByTestId } = renderHeader();

    const stashawayLogo = getByTestId("logo-svg");
    fireEvent.click(stashawayLogo);
    expect(mockHistory.push).toBeCalledWith("/");
  });

  it("should redirect to dashboard after 'My Events' link is clicked", () => {
    mockJwt();
    const { getByText } = renderHeader();
    mockAxios.mockResponse({ data: { name: "John Wick" } });
    const myEventsLink = getByText("My Events");
    fireEvent.click(myEventsLink);
    expect(mockHistory.push).toBeCalledWith("/dashboard");
  });
});

describe("logout functionality", () => {
  afterEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("should return to default ui after logout", () => {
    mockJwt();
    const { getByText } = render(
      <Header history={mockHistory} updateRegisteredEvents={jest.fn()} />
    );
    mockAxios.mockResponse({ data: { name: "John Wick" } });

    const logOutBtn = getByText("Log Out");
    fireEvent.click(logOutBtn);
    const headerLoginBtn = getByText("Log In");
    const headerSignupBtn = getByText("Sign Up");
    expect(headerLoginBtn).toBeInTheDocument();
    expect(headerSignupBtn).toBeInTheDocument();
  });

  it("should remove JWT token from session storage after user logout", () => {
    mockJwt();
    const { getByText } = render(
      <Header history={mockHistory} updateRegisteredEvents={jest.fn()} />
    );
    mockAxios.mockResponse({ data: { name: "John Wick" } });

    const spySessionStorageRemoveItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "removeItem"
    );

    const logOutBtn = getByText("Log Out");
    fireEvent.click(logOutBtn);

    expect(spySessionStorageRemoveItem).toHaveBeenCalledTimes(1);
    expect(spySessionStorageRemoveItem).toHaveBeenCalledWith("JWT");
  });
});

describe("catching error on axios", () => {
  afterEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("should remove JWT and redirect to landing page if axios return 401", () => {
    mockJwt();
    renderHeader();
    const spySessionStorageRemoveItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "removeItem"
    );
    mockAxios.mockError({ request: { status: 401 } });
    expect(mockHistory.push).toBeCalledWith("/");
    expect(spySessionStorageRemoveItem).toHaveBeenCalledTimes(1);
  });
});
