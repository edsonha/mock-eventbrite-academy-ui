import React from "react";
import Header from "./Header";
import "../styles/App.css";
import UpcomingEvents from "./UpcomingEvents";
// import mockEvents from "../__mockData__/mockEvents.mockdata";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      modal: false,
      email: "",
      password: ""
    };
  }

  modalToggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  loginToggle = () => {
    if (this.state.isLoggedIn) {
      this.modalToggle();
    }
    this.setState(prevState => ({
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
        {/* <UpcomingEvents upcomingEvents={mockEvents} /> */}
        <UpcomingEvents upcomingEvents={mockEventsWithSeats} />
      </div>
    );
  }
}

export default App;
