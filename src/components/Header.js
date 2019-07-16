import React from "react";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { Navbar, NavbarBrand, Button } from "reactstrap";
import LoginModal from "./LoginModal";
import "../styles/Header.css";

const Header = ({ isLoggedIn, loginToggle, modalToggle, modal, onChange }) => {
  if (isLoggedIn) {
    return (
      <Navbar className="navbar col" light expand="sm">
        <NavbarBrand>
          <Logo data-testid="logo-svg" />
        </NavbarBrand>
        <div className="button-wrapper">
          <h1>Welcome User</h1>
          <Button className="signup-button" onClick={loginToggle}>
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
          <Button className="login-button" onClick={modalToggle}>
            Log In
          </Button>
          <LoginModal
            loginToggle={loginToggle}
            isOpen={modal}
            modalToggle={modalToggle}
          />
          <Button className="signup-button">Sign Up</Button>
        </div>
      </Navbar>
    );
  }
};

export default Header;
