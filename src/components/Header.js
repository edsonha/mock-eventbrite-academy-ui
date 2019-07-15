import React from "react";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { Navbar, NavbarBrand, Button } from "reactstrap";
import "../styles/Header.css";

const Header = () => {
  return (
    <Navbar className="navbar col" light expand="sm">
      <NavbarBrand>
        <Logo data-testid="logo-svg" />
      </NavbarBrand>
      <div className="button-wrapper">
        <Button className="login-button" href="/">
          Log In
        </Button>
        <Button className="signup-button" href="/">
          Sign Up
        </Button>
      </div>
    </Navbar>
  );
};

export default Header;
