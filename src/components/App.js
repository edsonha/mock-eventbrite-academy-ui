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
    this.state = {
      isLoggedIn: false,
      registeredEvents: null,
    };
  }

  async componentDidMount() {
    const jwt = sessionStorage.getItem("JWT");
    if (jwt) {
      await axios({
        method: "get",
        url:
          process.env.REACT_APP_REST_API_LOCATION + "/profile/registeredevents",
        headers: { Authorization: "Bearer " + jwt },
      })
        .then(res => {
          this.updateRegisteredEvents(res.data);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  getRegisteredEventIdOnly = () => {
    const { registeredEvents } = this.state;
    return registeredEvents ? registeredEvents.map(event => event._id) : [];
  };

  updateRegisteredEvents = events => {
    this.setState({ registeredEvents: events });
  };

  render() {
    return (
      <div className="App">
        <Header
          history={appHistory}
          updateRegisteredEvents={this.updateRegisteredEvents}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <LandingPage
                registeredEvents={this.getRegisteredEventIdOnly()}
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
                updateRegisteredEvents={this.updateRegisteredEvents}
                isRegistered={this.getRegisteredEventIdOnly().includes(
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
                history={appHistory}
                registeredEvents={this.state.registeredEvents}
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
