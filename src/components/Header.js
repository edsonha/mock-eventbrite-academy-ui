import React from "react";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { Navbar, NavbarBrand, Nav, NavItem, Button } from "reactstrap";
import "../styles/Header.css";

const Header = () => {
  return (
    <Navbar className="navbar" light expand="md">
      <NavbarBrand href="/">
        <Logo data-testid="logo-svg" />
      </NavbarBrand>
      <Nav className="ml-auto" navbar>
        <NavItem>
          <Button className="login-button" href="/">
            Log In
          </Button>
        </NavItem>
        <NavItem>
          <Button className="signup-button" href="/">
            Sign Up
          </Button>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default Header;
