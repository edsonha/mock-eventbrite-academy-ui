import React from "react";
import Header from "./Header";
import "../styles/App.css";
import UpcomingEvents from "./UpcomingEvents";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      modal: false,
      email: "",
      password: ""
    };
    this.backendURI =
      process.env.NODE_ENV === "production"
        ? "https://stashaway-api.herokuapp.com/"
        : "http://localhost:3001";
  }

  modalToggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  loginToggle = () => {
    this.setState(prevState => ({
      modal: false,
      isLoggedIn: !prevState.isLoggedIn
    }));
  };

  render() {
    return (
      <div className="App">
        <Header
          isLoggedIn={this.state.isLoggedIn}
          loginToggle={this.loginToggle}
          modalToggle={this.modalToggle}
          modal={this.state.modal}
        />
        <UpcomingEvents backendURI={this.backendURI} />
      </div>
    );
  }
}

export default App;
