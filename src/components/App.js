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
      password: ""
    };
  }

  render() {
    return (
      <div className="App">
        <Header
          isLoggedIn={this.state.isLoggedIn}
          loginToggle={this.loginToggle}
          modalToggle={this.modalToggle}
          modal={this.state.modal}
          backendURI={this.backendURI}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <UpcomingEvents backendURI={this.backendURI} {...props} />
            )}
          />
          <Route
            path="/event/:id"
            render={({ match }) => (
              <EventDescriptionPage
                eventId={match.params.id}
                backendURI={this.backendURI}
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
