import React from "react";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { Navbar, Button } from "reactstrap";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import "../styles/Header.css";
import axios from "axios";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignupModalOpen: false,
      isLoginModalOpen: false,
      username: ""
    };
  }

  async componentDidMount() {
    const jwt = sessionStorage.getItem("JWT");
    if (jwt && !this.state.username) {
      await axios({
        method: "get",
        url: process.env.REACT_APP_REST_API_LOCATION + "/users/secure",
        headers: { Authorization: "Bearer " + jwt }
      })
        .then(res => {
          this.updateUsername(res.data.name);
        })
        .catch(err => {
          this._authErrHandler(err);
        });
    }
  }

  async componentDidUpdate() {
    const jwt = sessionStorage.getItem("JWT");

    if (jwt && !this.state.username) {
      await axios({
        method: "get",
        url: process.env.REACT_APP_REST_API_LOCATION + "/users/secure",
        headers: { Authorization: "Bearer " + jwt }
      })
        .then(res => {
          this.updateUsername(res.data.name);
        })
        .catch(err => {
          this._authErrHandler(err);
        });
    }
  }

  _authErrHandler = err => {
    if (err.request.status === 401) {
      sessionStorage.removeItem("JWT");
      this.props.history.push("/");
    }
  };

  updateUsername = name => {
    this.setState({
      username: name
    });
  };

  showSignupModal = isShown => {
    this.setState({ isSignupModalOpen: isShown });
  };

  showLoginModal = isShown => {
    this.setState({ isLoginModalOpen: isShown });
  };

  redirectTo = path => {
    this.props.history.push(path);
  };

  render() {
    return (
      <Navbar data-testid="app-header" className="navbar col" light expand="sm">
        <div
          className="logo-wrapper noselect"
          onClick={() => {
            this.redirectTo("/");
          }}
        >
          <Logo data-testid="logo-svg" className="logo" />
          Academy
        </div>
        {this.state.username && (
          <div className="button-wrapper-logged-in">
            <div
              className="my-events-link noselect"
              onClick={() => {
                this.redirectTo("/dashboard");
              }}
            >
              My Events
            </div>
            <div className="welcome-msg">
              {getUserInitial(this.state.username)}
            </div>
            <Button
              className="logout-button"
              onClick={() => {
                this.setState({
                  username: ""
                });
                this.props.updateRegisteredEvents([]);
                sessionStorage.removeItem("JWT");
              }}
            >
              Log Out
            </Button>
          </div>
        )}

        {!this.state.username && (
          <div className="button-wrapper-not-logged-in">
            <Button
              className="login-button"
              onClick={() => this.showLoginModal(true)}
            >
              Log In
            </Button>
            <LoginModal
              isOpen={this.state.isLoginModalOpen}
              showLoginModal={this.showLoginModal}
              showSignupModal={this.showSignupModal}
              history={this.props.history}
              notFromRegisterBtn={true}
              updateRegisteredEvents={this.props.updateRegisteredEvents}
            />

            <Button
              className="signup-button"
              onClick={() => this.showSignupModal(true)}
            >
              Sign Up
            </Button>
            <SignupModal
              isOpen={this.state.isSignupModalOpen}
              showLoginModal={this.showLoginModal}
              showSignupModal={this.showSignupModal}
            />
          </div>
        )}
      </Navbar>
    );
  }
}

export default Header;

const getUserInitial = name => {
  const nameArray = name.split(" ");
  let initials = "";

  for (let word of nameArray) {
    initials += word[0].toUpperCase();
    if (initials.length === 2) {
      break;
    }
  }
  return initials;
};
