import React from "react";
import { Redirect } from "react-router-dom";
// import axios from "axios";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: this.props.isLoggedIn };
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
    if (this.state.isLoggedIn) {
      return <p>Dashboard</p>;
    } else return <Redirect to="/" />;
  }
}

export default Dashboard;
