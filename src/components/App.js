import React from "react";
import Header from "./Header";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import UpcomingEvents from "./UpcomingEvents";
import EventDescriptionPage from "./EventDescriptionPage";
import "../styles/App.css";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.backendURI = process.env.REACT_APP_REST_API_LOCATION;
    this.state = {
      email: "",
      password: "",
      loginModal: false,
      isLoggedIn: false,
      user: ""
    };
  }

  loginModalToggle = () => {
    this.setState(prevState => ({
      loginModal: !prevState.loginModal
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
      <div className="App">
        <Header
          isLoggedIn={this.state.isLoggedIn}
          backendURI={this.backendURI}
          loginModal={this.state.loginModal}
          loginModalToggle={this.loginModalToggle}
          loginToggle={this.loginToggle}
          user={this.state.user}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <UpcomingEvents
                backendURI={this.backendURI}
                loginModalToggle={this.loginModalToggle}
                {...props}
              />
            )}
          />
          <Route
            path="/event/:id"
            render={({ match }) => (
              <EventDescriptionPage
                eventId={match.params.id}
                backendURI={this.backendURI}
                loginModalToggle={this.loginModalToggle}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

const MainApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
export default MainApp;
