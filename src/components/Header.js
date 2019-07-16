import React from "react";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { Navbar, NavbarBrand, Button } from "reactstrap";
import LoginModal from "./LoginModal";
import "../styles/Header.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    return (
      <Navbar className="navbar col" light expand="sm">
        <NavbarBrand>
          <Logo data-testid="logo-svg" />
        </NavbarBrand>
        <div className="button-wrapper">
          <Button className="login-button" onClick={this.toggle}>
            Log In
          </Button>
          <LoginModal
            data-testid="login-modal"
            isOpen={this.state.modal}
            toggle={this.toggle}
          />
          <Button className="signup-button" href="/">
            Sign Up
          </Button>
        </div>
      </Navbar>
    );
  }
}

export default Header;
