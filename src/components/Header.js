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
      loginModal: false,
      signupModal: false,
      isLoggedIn: false,
      user: ""
    };
    this.backendURI = props.backendURI;
  }

  loginModalToggle = () => {
    this.setState(prevState => ({
      loginModal: !prevState.loginModal
    }));
  };

  signupModalToggle = () => {
    this.setState(prevState => ({
      signupModal: !prevState.signupModal
    }));
  };

  loginToggle = data => {
    if (!this.state.isLoggedIn) {
      const nameArray = data.split(" ");
      let initials = "";

      for (let word of nameArray) {
        initials += word[0];
        if (initials.length === 2) {
          break;
        }
      }

      this.setState({
        user: initials
      });
    }

    this.setState(prevState => ({
      loginModal: false,
      isLoggedIn: !prevState.isLoggedIn
    }));
  };

  render() {
    return (
      <Navbar data-testid="app-header" className="navbar col" light expand="sm">
        <Link to="/">
          <Logo data-testid="logo-svg" />
        </Link>
        {this.state.isLoggedIn && (
          <div className="button-wrapper">
            <div className="welcome-msg">{`${this.state.user}`}</div>

            <Button className="logout-button" onClick={this.loginToggle}>
              Log Out
            </Button>
          </div>
        )}
        {!this.state.isLoggedIn && (
          <div className="button-wrapper">
            <Button className="login-button" onClick={this.loginModalToggle}>
              Log In
            </Button>
            <LoginModal
              loginToggle={this.loginToggle}
              isOpen={this.state.loginModal}
              loginModalToggle={this.loginModalToggle}
              backendURI={this.backendURI}
            />

            <Button className="signup-button" onClick={this.signupModalToggle}>
              Sign Up
            </Button>
            <SignupModal
              isOpen={this.state.signupModal}
              signupModalToggle={this.signupModalToggle}
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
