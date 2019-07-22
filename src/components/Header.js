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
      signupModal: false
    };
    this.backendURI = props.backendURI;
  }

  signupModalToggle = () => {
    this.setState(prevState => ({
      signupModal: !prevState.signupModal
    }));
  };

  render() {
    return (
      <Navbar data-testid="app-header" className="navbar col" light expand="sm">
        <Link to="/">
          <Logo data-testid="logo-svg" />
        </Link>
        {this.props.isLoggedIn && (
          <div className="button-wrapper">
            <div className="welcome-msg">{`${this.props.user}`}</div>

            <Button className="logout-button" onClick={this.props.loginToggle}>
              Log Out
            </Button>
          </div>
        )}
        {!this.props.isLoggedIn && (
          <div className="button-wrapper">
            <Button
              className="login-button"
              onClick={this.props.loginModalToggle}
            >
              Log In
            </Button>
            <LoginModal
              loginToggle={this.props.loginToggle}
              isOpen={this.props.loginModal}
              loginModalToggle={this.props.loginModalToggle}
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
