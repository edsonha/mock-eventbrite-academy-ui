import React from "react";
import Header from "./Header";
import { Switch, Route, Router } from "react-router-dom";
import LandingPage from "./LandingPage";
import EventDescriptionPage from "./EventDescriptionPage";
import Dashboard from "./Dashboard";
import "../styles/App.css";
import HttpsRedirect from "react-https-redirect";
import { createBrowserHistory } from "history";
import axios from "axios";
export const appHistory = createBrowserHistory();
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.backendURI = process.env.REACT_APP_REST_API_LOCATION;
    this.state = {
      isLoggedIn: false,
      registeredEvents: []
    };
  }

  async componentDidMount() {
    const jwt = sessionStorage.getItem("JWT");
    if (jwt) {
      await axios({
        method: "get",
        url: this.backendURI + "/user/registeredevents",
        headers: { Authorization: "Bearer " + jwt }
      })
        .then(res => {
          const regEventId = res.data.map(event => event._id);
          this.updateRegisteredEvents(regEventId);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  setLoginState = isLoggedIn => {
    if (!isLoggedIn) {
      this.setState({ isLoggedIn, registeredEvents: [] });
    } else {
      this.setState({
        isLoggedIn
      });
    }
  };

  updateRegisteredEvents = events => {
    this.setState({ registeredEvents: events });
  };

  render() {
    return (
      <div className="App">
        <Header
          backendURI={this.backendURI}
          setLoginState={this.setLoginState}
          history={appHistory}
          updateRegisteredEvents={this.updateRegisteredEvents}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <LandingPage
                backendURI={this.backendURI}
                setLoginState={this.setLoginState}
                registeredEvents={this.state.registeredEvents}
                updateRegisteredEvents={this.updateRegisteredEvents}
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
                setLoginState={this.setLoginState}
                updateRegisteredEvents={this.updateRegisteredEvents}
                isRegistered={this.state.registeredEvents.includes(
                  match.params.id
                )}
              />
            )}
          />
          <Route
            exact
            path="/dashboard"
            render={props => (
              <Dashboard
                backendURI={this.backendURI}
                history={appHistory}
                updateRegisteredEvents={this.updateRegisteredEvents}
                {...props}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

const MainApp = () => (
  <HttpsRedirect>
    <Router history={appHistory}>
      <App />
    </Router>
  </HttpsRedirect>
);
export default MainApp;
