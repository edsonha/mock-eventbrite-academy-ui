import React from "react";
import axios from "axios";
import moment from "moment";
import EventCard from "./EventCard";
import "../styles/Dashboard.css";
import { Container, Row, Spinner } from "reactstrap";
import SectionTitle from "./SectionTitle";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, myEvents: [] };
  }

  eventDescriptionPageHandler = id => {
    this.props.history.push("/event/" + id);
  };

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
      return (
        <Container>
          <Row>
            <SectionTitle sectionTitle={"Upcoming Events"} />
          </Row>
          <div
            className="dashboard-events-loader"
            data-testid="dashboard-events"
          >
            <Spinner size="lg" color="primary" />
          </div>
        </Container>
      );
    } else if (this.state.myEvents.length === 0) {
      return (
        <Container>
          <div className="no-dashboard-events" data-testid="dashboard-events">
            <Row>
              <SectionTitle sectionTitle={"Registered Events"} />
            </Row>
            <Row>
              <h3>No registered events.</h3>
            </Row>
          </div>
        </Container>
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
            className={"is-registered"}
          />
        ));
      return (
        <React.Fragment>
          <Container data-testid="dashboard-events" id="dashboard-events">
            <Row>
              <SectionTitle sectionTitle={"Registered Events"} />
            </Row>
            <Row>{eventCards}</Row>
          </Container>
        </React.Fragment>
      );
    }
  }
}

export default Dashboard;
