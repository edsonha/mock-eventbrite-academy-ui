import React from "react";
import axios from "axios";
import moment from "moment";
import EventCard from "./EventCard";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, myEvents: [] };
  }

  async componentDidMount() {
    const jwt = sessionStorage.getItem("JWT");
    if (jwt) {
      await axios({
        method: "get",
        url: this.props.backendURI + "/user/registeredevents",
        headers: { Authorization: "Bearer " + jwt }
      })
        .then(res => {
          this.setState({ isLoading: false, myEvents: res.data });
        })
        .catch(err => {
          sessionStorage.removeItem("JWT");
          this.props.history.push("/");
        });
    } else {
      this.props.history.push("/");
    }
  }

  async componentDidUpdate() {
    const jwt = sessionStorage.getItem("JWT");

    if (!jwt) {
      this.props.history.push("/");
    }
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading</p>;
    } else if (this.state.myEvents.length === 0) {
      return (
        <React.Fragment>
          <h1>Registered Events</h1>
          <p>No registered events</p>;
        </React.Fragment>
      );
    } else {
      const eventCards = this.state.myEvents
        .filter(event => moment.utc(event.time).toDate() - Date.now() > 0)
        .map(event => (
          <EventCard
            key={event._id}
            eventDetail={event}
            eventDescriptionPageHandler={this.eventDescriptionPageHandler}
            setLoginState={this.props.setLoginState}
            isRegistered={true}
          />
        ));
      return (
        <React.Fragment>
          <h1>Registered Events</h1>
          <div>{eventCards}</div>
        </React.Fragment>
      );
    }
  }
}

export default Dashboard;
