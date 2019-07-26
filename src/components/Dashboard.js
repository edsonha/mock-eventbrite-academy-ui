import React from "react";
// import { Redirect } from "react-router-dom";
import axios from "axios";

/* istanbul ignore next */
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
          console.log(err.message);
          sessionStorage.removeItem("JWT");
          this.props.history.push("/");
        });
    } else {
      this.props.history.push("/");
    }
  }

  // async componentDidMount() {
  //   await axios
  //     .get(process.env.REACT_APP_REST_API_LOCATION + "/users/secure", {
  //       headers: { Authorization: `Bearer ${sessionStorage.getItem("JWT")}` }
  //     })
  //     .then(
  //       res => {
  //         console.log("SECURE SUCESS");
  //         this.setState({ isLoggedIn: true });
  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     );
  // }

  render() {
    if (this.state.isLoading) {
      return <p>Loading</p>;
    } else {
      return <p>Dashboard</p>;
    }
  }
}

export default Dashboard;
