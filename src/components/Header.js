import React from "react";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { Navbar, Button } from "reactstrap";
import { BrowserRouter, Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import "../styles/Header.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignupModalOpen: false,
      isLoginModalOpen: false,
      username: ""
    };
    this.backendURI = props.backendURI;
  }

  setUsername = username => {
    this.setState({ username });
  };

  showSignupModal = isShown => {
    this.setState({ isSignupModalOpen: isShown });
  };

  showLoginModal = isShown => {
    this.setState({ isLoginModalOpen: isShown });
  };

  getUserInitial = name => {
    const nameArray = name.split(" ");
    let initials = "";

    for (let word of nameArray) {
      initials += word[0];
      if (initials.length === 2) {
        break;
      }
    }
    return initials;
  };

  render() {
    return (
      <Navbar data-testid="app-header" className="navbar col" light expand="sm">
        <Link className="logo-wrapper" to="/">
          <Logo data-testid="logo-svg" />
        </Link>
        {this.props.isLoggedIn && (
          <div className="button-wrapper">
            <div className="welcome-msg">
              {this.getUserInitial(this.state.username)}
            </div>

            {/* <Button className="logout-button" onClick={this.props.loginToggle}> */}
            <Button
              className="logout-button"
              onClick={() => {
                this.props.setLoginState(false);
                sessionStorage.removeItem("JWT");
              }}
            >
              Log Out
            </Button>
          </div>
        )}
        {!this.props.isLoggedIn && (
          <div className="button-wrapper">
            <Button
              className="login-button"
              onClick={() => this.showLoginModal(true)}
            >
              Log In
            </Button>
            <LoginModal
              setUsername={this.setUsername}
              setLoginState={this.props.setLoginState}
              isOpen={this.state.isLoginModalOpen}
              showLoginModal={this.showLoginModal}
              backendURI={this.backendURI}
            />

            <Button
              className="signup-button"
              onClick={() => this.showSignupModal(true)}
            >
              Sign Up
            </Button>
            <SignupModal
              isOpen={this.state.isSignupModalOpen}
              showSignupModal={this.showSignupModal}
              backendURI={this.backendURI}
            />
          </div>
        )}
      </Navbar>
    );
  }
}

export function HeaderWithRouter(props) {
  return (
    <BrowserRouter>
      <Header backendURI={props.backendURI} />
    </BrowserRouter>
  );
}

export default Header;
