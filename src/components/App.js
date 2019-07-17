import React from "react";
import Header from "./Header";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import UpcomingEvents from "./UpcomingEvents";
import EventDescriptionPage from "./EventDescriptionPage";
import "../styles/App.css";

class App extends React.Component {
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
      <BrowserRouter>
        <div className="App">
          <Header
            isLoggedIn={this.state.isLoggedIn}
            loginToggle={this.loginToggle}
            modalToggle={this.modalToggle}
            modal={this.state.modal}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <UpcomingEvents backendURI={this.backendURI} {...props} />
              )}
            />
            <Route path="/event/:id" render={() => <EventDescriptionPage />} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
