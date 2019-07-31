import React from "react";
import Header from "../components/Header";
import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import MainApp from "../../src/components/App";
import mockEventsWithSeats from "../../src/__mockData__/mockEventsWithSeats.mockdata";
import mockCourses from "../../src/__mockData__/mockCourses.mockdata";
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
    <Header history={mockHistory} backendURI="dummy" />
  );
  return { getByText, getAllByText, queryByText, getByTestId };
};

describe("starting UI", () => {
  afterEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });
  it("should show Stashaway logo, Login and Sign Up buttons when you are not logged in", () => {
    const { getByText, getByTestId } = render(<Header />);
    const loginBtn = getByText("Log In");
    const signUpBtn = getByText("Sign Up");
    const logo = getByTestId("logo-svg");
    expect(loginBtn).toBeInTheDocument();
    expect(signUpBtn).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
  });

  it("should clear inputs and close Login Modal when X button is clicked", async () => {
    const {
      getAllByText,
      getByPlaceholderText,
      getByText,
      queryByTestId
    } = render(<MainApp />);

    const headerLoginBtn = getAllByText("Log In")[0];
    fireEvent.click(headerLoginBtn);
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "john@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });

    expect(emailInput).toHaveAttribute("value", "john@gmail.com");
    expect(passwordInput).toHaveAttribute("value", "abcdefgh");

    const closeBtn = getByText("×");
    fireEvent.click(closeBtn);
    expect(await queryByTestId("login-modal")).toBe(null);
  });

  it("should close login modal when Cancel button is clicked", async () => {
    const container = render(<MainApp />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const {
      getByText,
      getByPlaceholderText,
      getByTestId,
      queryByTestId
    } = container;

    fireEvent.click(getByText("Log In"));

    expect(await getByTestId("login-modal")).toBeInTheDocument();

    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "john@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });

    expect(emailInput).toHaveAttribute("value", "john@gmail.com");
    expect(passwordInput).toHaveAttribute("value", "abcdefgh");

    fireEvent.click(getByText("Cancel"));
    expect(await queryByTestId("login-modal")).toBe(null);
  });

  it("should clear inputs and close Signup Modal when X button is clicked", async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByLabelText,
      queryByTestId
    } = render(<MainApp />);

    let headerSignupBtn = getByText("Sign Up");
    fireEvent.click(headerSignupBtn);
    const nameInput = getByLabelText("Name");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByLabelText("Password");
    const passwordConfirmationInput = getByLabelText("Confirm Password");
    fireEvent.change(nameInput, { target: { value: "Sally" } });
    fireEvent.change(emailInput, { target: { value: "sally@hotmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123!@#" } });
    fireEvent.change(passwordConfirmationInput, {
      target: { value: "password123!@#" }
    });
    expect(nameInput).toHaveAttribute("value", "Sally");
    expect(emailInput).toHaveAttribute("value", "sally@hotmail.com");
    expect(passwordInput).toHaveAttribute("value", "password123!@#");
    expect(passwordConfirmationInput).toHaveAttribute(
      "value",
      "password123!@#"
    );

    const closeBtn = getByText("×");
    fireEvent.click(closeBtn);
    expect(await queryByTestId("signup-header")).toBe(null);
  });
});

describe("login functionality", () => {
  afterEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should login user when correct info is given and the header will show initials and "Log Out" button', () => {
    const { getByText, getAllByText, getByPlaceholderText } = render(
      <MainApp />
    );
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const headerLoginBtn = getAllByText("Log In")[0];
    fireEvent.click(headerLoginBtn);
    const goBtn = getByText("Go!");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "john@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });
    fireEvent.click(goBtn);
    mockAxios.mockResponse({
      data: { name: "John Wick" }
    });
    mockAxios.mockResponse({
      data: { name: "John Wick" }
    });

    const logOutBtn = getByText("Log Out");
    const welcomeMessage = getByText("JW");
    expect(emailInput).not.toBeInTheDocument();

    expect(welcomeMessage).toBeInTheDocument();
    expect(logOutBtn).toBeInTheDocument();
  });

  it("should login user when correct info is given and store JWT token in session storage", () => {
    const { getByText, getAllByText, getByPlaceholderText } = render(
      <MainApp />
    );
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });
    const spySessionStorageSetItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "setItem"
    );
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
      data: { name: "John Wick", jwtToken: mockJwtToken }
    });

    mockAxios.mockResponse({
      data: { name: "John Wick" }
    });
    expect(spySessionStorageSetItem).toHaveBeenCalledTimes(1);
    expect(spySessionStorageSetItem).toHaveBeenCalledWith("JWT", mockJwtToken);

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
  });

  it("should deny login when credentials are wrong and show an error message", async () => {
    const { getByText, getAllByText, getByPlaceholderText } = render(
      <MainApp />
    );
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const headerLoginBtn = getAllByText("Log In")[0];
    fireEvent.click(headerLoginBtn);
    const goBtn = getByText("Go!");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByPlaceholderText("********");
    fireEvent.change(emailInput, { target: { value: "peter@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(goBtn);

    mockAxios.mockError({
      response: { data: { message: "Wrong credentials" } }
    });
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(getByText("Wrong credentials")).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
  });

  it("should open up sign up modal when sign up link is clicked", async () => {
    const { getByText, getAllByText, getByLabelText } = render(<MainApp />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const headerLoginBtn = getAllByText("Log In")[0];
    fireEvent.click(headerLoginBtn);

    const linkToSignUp = getByText("Sign Up!");
    fireEvent.click(linkToSignUp);

    const confirmPassword = getByLabelText("Confirm Password");
    expect(confirmPassword).toBeInTheDocument();
  });
});

describe("logout functionality", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should return to default ui after logout", () => {
    const { getByText } = render(<MainApp />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    let headerLoginBtn = getByText("Log In");
    let headerSignupBtn = getByText("Sign Up");

    fireEvent.click(headerLoginBtn);
    const goBtn = getByText("Go!");
    fireEvent.click(goBtn);

    mockAxios.mockResponse({ data: { name: "John Wick" } });
    mockAxios.mockResponse({ data: { name: "John Wick" } });

    expect(headerLoginBtn).not.toBeInTheDocument();
    expect(headerSignupBtn).not.toBeInTheDocument();

    const logOutBtn = getByText("Log Out");
    fireEvent.click(logOutBtn);
    headerLoginBtn = getByText("Log In");
    headerSignupBtn = getByText("Sign Up");
    expect(headerLoginBtn).toBeInTheDocument();
    expect(headerSignupBtn).toBeInTheDocument();
  });

  it("should remove JWT token from session storage after user logout", () => {
    const { getByText } = render(<MainApp />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });
    // const spySessionStorageSetItem = jest.spyOn(
    //   window.sessionStorage.__proto__,
    //   "setItem"
    // );
    const spySessionStorageRemoveItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "removeItem"
    );
    const mockJwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWxseUBnbWFpbC5jb20iLCJ1c2VyIjoiU2FsbHkiLCJpYXQiOjE1NjM4NTk5NjcyMDUsImV4cCI6MTU2Mzg1OTk3MDgwNX0.rC3dnj_r-mhL1tp3hj9JecjOpuZFrVY64SPSpS1fBPQ";

    const headerLoginBtn = getByText("Log In");
    fireEvent.click(headerLoginBtn);
    const goBtn = getByText("Go!");
    fireEvent.click(goBtn);

    mockAxios.mockResponse({
      data: { name: "John Wick", jwtToken: mockJwtToken }
    });

    mockAxios.mockResponse({
      data: { name: "John Wick" }
    });

    const logOutBtn = getByText("Log Out");
    fireEvent.click(logOutBtn);

    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    // expect(spySessionStorageSetItem).toHaveBeenCalledTimes(1);
    // expect(spySessionStorageSetItem).toHaveBeenCalledWith("JWT", mockJwtToken);
    expect(spySessionStorageRemoveItem).toHaveBeenCalledTimes(1);
    expect(spySessionStorageRemoveItem).toHaveBeenCalledWith("JWT");
  });
});

describe("sign up functionlaity", () => {
  afterEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it("should display 'Account created! when registration succeeds", () => {
    const container = render(<MainApp />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const {
      getByText,
      getAllByText,
      getByPlaceholderText,
      getByLabelText
    } = container;
    const headerSignupBtn = getAllByText("Sign Up")[0];
    fireEvent.click(headerSignupBtn);

    const goBtn = getByText("Go!");
    const nameInput = getByPlaceholderText("username");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByLabelText("Password");
    const passwordConfirmationInput = getByLabelText("Confirm Password");

    fireEvent.change(nameInput, { target: { value: "Sally Yang" } });
    fireEvent.change(emailInput, { target: { value: "sally@hotmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123!@#" } });
    fireEvent.change(passwordConfirmationInput, {
      target: { value: "password123!@#" }
    });
    fireEvent.click(goBtn);

    mockAxios.mockResponse({
      data: { message: "Account created!", name: "Sally Yang" }
    });
    expect(mockAxios.post).toHaveBeenCalledTimes(1);

    // const messageBox = getByText("Account created!");
    // expect(messageBox).toBeInTheDocument();
  });

  // it("should log user in when registration succeeds", () => {
  //   const container = render(<MainApp />);
  //   mockAxios.mockResponse({ data: mockEventsWithSeats });

  //   const {
  //     getByText,
  //     getAllByText,
  //     getByPlaceholderText,
  //     getByLabelText
  //   } = container;
  //   const headerSignupBtn = getAllByText("Sign Up")[0];
  //   fireEvent.click(headerSignupBtn);

  //   const goBtn = getByText("Go!");
  //   const nameInput = getByPlaceholderText("username");
  //   const emailInput = getByPlaceholderText("myemail@email.com");
  //   const passwordInput = getByLabelText("Password");
  //   const passwordConfirmationInput = getByLabelText("Confirm Password");

  //   fireEvent.change(nameInput, { target: { value: "Sally" } });
  //   fireEvent.change(emailInput, { target: { value: "sally@hotmail.com" } });
  //   fireEvent.change(passwordInput, { target: { value: "password123!@#" } });
  //   fireEvent.change(passwordConfirmationInput, {
  //     target: { value: "password123!@#" }
  //   });
  //   fireEvent.click(goBtn);

  //   expect(goBtn).not.toBeInTheDocument();
  //   expect(getByText("Log Out")).toBeInTheDocument();
  // });

  it("should deny register when input is invalid", async () => {
    const { getByText, getByPlaceholderText, getByLabelText } = render(
      <MainApp />
    );
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const headerSignupBtn = getByText("Sign Up");
    fireEvent.click(headerSignupBtn);
    const goBtn = getByText("Go!");
    const nameInput = getByLabelText("Name");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByLabelText("Password");
    const passwordConfirmationInput = getByLabelText("Confirm Password");

    fireEvent.change(nameInput, { target: { value: "Sally" } });
    fireEvent.change(emailInput, { target: { value: "sally@hotmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password1" } });
    fireEvent.change(passwordConfirmationInput, {
      target: { value: "password" }
    });

    fireEvent.click(goBtn);

    mockAxios.mockResponse({ data: { message: "Cannot create account" } });
    expect(mockAxios.post).toHaveBeenCalledTimes(1);

    const messageBox = getByText("Cannot create account");
    expect(messageBox).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
  });

  it("should show 'Cannot create account in case of server error", async () => {
    const { getByText, getByPlaceholderText, getByLabelText } = render(
      <MainApp />
    );
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const headerSignupBtn = getByText("Sign Up");
    fireEvent.click(headerSignupBtn);

    const goBtn = getByText("Go!");
    const nameInput = getByLabelText("Name");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByLabelText("Password");
    const passwordConfirmationInput = getByLabelText("Confirm Password");

    fireEvent.change(nameInput, { target: { value: "Sally" } });
    fireEvent.change(emailInput, { target: { value: "sally@hotmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123!@#" } });
    fireEvent.change(passwordConfirmationInput, {
      target: { value: "password123!@#" }
    });
    fireEvent.click(goBtn);
    mockAxios.mockError({
      response: { data: { message: "Something went wrong, please try again" } }
    });

    const messageBox = getByText("Something went wrong, please try again");
    expect(messageBox).toBeInTheDocument();
    expect(goBtn).toBeInTheDocument();
  });

  it("should close sign up modal when Cancel button is clicked", async () => {
    const container = render(<MainApp />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const {
      getByText,
      getByPlaceholderText,
      getByLabelText,
      queryByTestId
    } = container;

    fireEvent.click(getByText("Sign Up"));

    const nameInput = getByLabelText("Name");
    const emailInput = getByPlaceholderText("myemail@email.com");
    const passwordInput = getByLabelText("Password");
    const confirmPasswordInput = getByLabelText("Confirm Password");
    fireEvent.change(nameInput, { target: { value: "Sally" } });
    fireEvent.change(emailInput, { target: { value: "sally@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123!@#" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123!@#" }
    });
    expect(nameInput).toHaveAttribute("value", "Sally");
    expect(emailInput).toHaveAttribute("value", "sally@gmail.com");
    expect(passwordInput).toHaveAttribute("value", "password123!@#");
    expect(confirmPasswordInput).toHaveAttribute("value", "password123!@#");

    fireEvent.click(await getByText("Cancel"));
    expect(queryByTestId("signup-form")).toBe(null);
  });

  it("should open up log in modal when log in link is clicked", async () => {
    const { getByText, getAllByText } = render(<MainApp />);
    mockAxios.mockResponse({ data: mockEventsWithSeats });
    mockAxios.mockResponse({ data: mockCourses });

    const headerSignupBtn = getAllByText("Sign Up")[0];
    fireEvent.click(headerSignupBtn);

    const linkToLogIn = getByText("Log In!");
    fireEvent.click(linkToLogIn);

    const signupReminder = getByText("Don't have an account yet?");
    expect(signupReminder).toBeInTheDocument();
  });
});

describe("dashboard entry point", () => {
  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });
  it("should show link to My Events after login is successful", () => {
    mockJwt();
    const { getByText } = renderHeader();
    mockAxios.mockResponse({ data: { name: "John Wick" } });
    expect(getByText("My Events")).toBeInTheDocument();
  });

  it("should redirect to dashboard after 'My Events' link is clicked", async () => {
    mockJwt();
    const { getByText } = renderHeader();
    mockAxios.mockResponse({ data: { name: "John Wick" } });
    const myEventsLink = getByText("My Events");
    fireEvent.click(myEventsLink);
    expect(mockHistory.push).toBeCalledWith("/dashboard");
  });
});

describe("routing of the stashaway icon header to the landing page", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("routing of the stashaway icon header to the landing page", () => {
    const { getByTestId } = renderHeader();
    mockAxios.mockResponse({ data: { name: "John Wick" } });

    const stashawayLogo = getByTestId("logo-svg");
    fireEvent.click(stashawayLogo);
    expect(mockHistory.push).toBeCalledWith("/");
  });
});

describe("catching error on axios", () => {
  afterEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });
  it("should call history.push with root route if axios return 401", () => {
    mockJwt();
    renderHeader();
    const spySessionStorageRemoveItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "removeItem"
    );
    mockAxios.mockError();
    expect(mockHistory.push).toBeCalledWith("/");
    expect(spySessionStorageRemoveItem).toHaveBeenCalledTimes(1);
  });
  it("should call history.push with root route if axios return 401", () => {
    mockJwt();
    const { getByText } = renderHeader();
    const spySessionStorageRemoveItem = jest.spyOn(
      window.sessionStorage.__proto__,
      "removeItem"
    );
    const logoText = getByText("Academy");
    fireEvent.click(logoText);
    mockAxios.mockError();
    expect(mockHistory.push).toBeCalledWith("/");
    expect(spySessionStorageRemoveItem).toHaveBeenCalledTimes(1);
  });
});
