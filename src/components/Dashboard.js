import React from "react";
import axios from "axios";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }

  async componentDidMount() {
    const jwt = sessionStorage.getItem("JWT");

    if (jwt) {
      await axios({
        method: "get",
        url: this.props.backendURI + "/users/secure",
        headers: { Authorization: "Bearer " + jwt }
      })
        .then(res => {
          this.setState({ isLoading: false });
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
    } else {
      return <p>Dashboard</p>;
    }
  }
}

export default Dashboard;
