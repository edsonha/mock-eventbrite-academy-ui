import React from "react";
import axios from "axios";

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
          <h1>My Events</h1>
          <p>No registered events</p>;
        </React.Fragment>
      );
    } else {
      return <h1>My Events</h1>;
    }
  }
}

export default Dashboard;
