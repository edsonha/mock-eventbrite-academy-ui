import React from "react";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { Navbar, NavbarBrand, Button } from "reactstrap";
import LoginModal from "./LoginModal";
import "../styles/Header.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      isLoggedIn: false,
      user: ""
    };
    this.backendURI = props.backendURI;
  }

  modalToggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
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
      modal: false,
      isLoggedIn: !prevState.isLoggedIn
    }));
  };

  render() {
    if (this.state.isLoggedIn) {
      return (
        <Navbar className="navbar col" light expand="sm">
          <NavbarBrand>
            <Logo data-testid="logo-svg" />
          </NavbarBrand>
          <div className="button-wrapper">
            <div className="welcome-msg">{`${this.state.user}`}</div>

            <Button className="logout-button" onClick={this.loginToggle}>
              Log Out
            </Button>
          </div>
        </Navbar>
      );
    } else {
      return (
        <Navbar className="navbar col" light expand="sm">
          <NavbarBrand>
            <Logo data-testid="logo-svg" />
          </NavbarBrand>
          <div className="button-wrapper">
            <Button className="login-button" onClick={this.modalToggle}>
              Log In
            </Button>
            <LoginModal
              loginToggle={this.loginToggle}
              isOpen={this.state.modal}
              modalToggle={this.modalToggle}
              backendURI={this.backendURI}
            />
            <Button className="signup-button">Sign Up</Button>
          </div>
        </Navbar>
      );
    }
  }
}

export default Header;
