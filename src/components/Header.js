import React from "react";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { Navbar, Button } from "reactstrap";
// import { Router } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import "../styles/Header.css";
import axios from "axios";
// import { createBrowserHistory } from "history";
// export const appHistory = createBrowserHistory();

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignupModalOpen: false,
      isLoginModalOpen: false,
      username: "",
      initials: ""
    };
    this.backendURI = props.backendURI;
  }

  async componentDidMount() {
    const jwt = sessionStorage.getItem("JWT");

    if (jwt && !this.state.username) {
      await axios({
        method: "get",
        url: this.backendURI + "/users/secure",
        headers: { Authorization: "Bearer " + jwt }
      })
        .then(res => {
          this.updateUsername(res.data.name);
          this.getUserInitial(res.data.name);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  async componentDidUpdate() {
    const jwt = sessionStorage.getItem("JWT");

    if (jwt && !this.state.username) {
      await axios({
        method: "get",
        url: this.backendURI + "/users/secure",
        headers: { Authorization: "Bearer " + jwt }
      })
        .then(res => {
          this.updateUsername(res.data.name);
          this.getUserInitial(res.data.name);
        })
        .catch(err => console.log(err.message));
    }
  }

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

  getUserInitial = name => {
    const nameArray = name.split(" ");
    let initials = "";

    for (let word of nameArray) {
      initials += word[0].toUpperCase();
      if (initials.length === 2) {
        break;
      }
    }
    this.setState({
      initials
    });
  };
  redirectToHome = () => {
    this.props.history.push("/");
  };
  redirectToDashboard = () => {
    this.props.history.push("/dashboard");
  };

  render() {
    return (
      <Navbar data-testid="app-header" className="navbar col" light expand="sm">
        <Logo data-testid="logo-svg" onClick={this.redirectToHome} />
        {this.state.username && (
          <div className="button-wrapper">
            <Button
              className="my-events-link"
              onClick={this.redirectToDashboard}
            >
              My Events
            </Button>
            <div className="welcome-msg">{this.state.initials}</div>
            <Button
              className="logout-button"
              onClick={() => {
                this.setState({
                  username: ""
                });
                this.props.setLoginState(false);
                sessionStorage.removeItem("JWT");
              }}
            >
              Log Out
            </Button>
          </div>
        )}

        {!this.state.username && (
          <div className="button-wrapper">
            <Button
              className="login-button"
              onClick={() => this.showLoginModal(true)}
            >
              Log In
            </Button>
            <LoginModal
              setLoginState={this.props.setLoginState}
              isOpen={this.state.isLoginModalOpen}
              showLoginModal={this.showLoginModal}
              showSignupModal={this.showSignupModal}
              backendURI={this.backendURI}
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
              setLoginState={this.props.setLoginState}
              backendURI={this.backendURI}
            />
          </div>
        )}
      </Navbar>
    );
  }
}

// export function HeaderWithRouter(props) {
//   return (
//     <Router history={props.history}>
//       <Header history={props.history} backendURI={props.backendURI} />
//     </Router>
//   );
// }

export default Header;
