import React from "react";
import Header from "./Header";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import LandingPage from "./LandingPage";
import EventDescriptionPage from "./EventDescriptionPage";
import "../styles/App.css";
import HttpsRedirect from "react-https-redirect";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.backendURI = process.env.REACT_APP_REST_API_LOCATION;
    this.state = {
      isLoggedIn: false
    };
  }

  setLoginState = isLoggedIn => {
    this.setState({
      isLoggedIn
    });
  };

  render() {
    return (
      <div className="App">
        <Header
          isLoggedIn={this.state.isLoggedIn}
          backendURI={this.backendURI}
          setLoginState={this.setLoginState}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <LandingPage backendURI={this.backendURI} {...props} />
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
  <HttpsRedirect>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HttpsRedirect>
);
export default MainApp;
