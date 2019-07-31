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
        url: this.props.backendURI + "/profile/registeredevents",
        headers: { Authorization: "Bearer " + jwt },
      })
        .then(res => {
          this.setState({ isLoading: false, myEvents: res.data });
          const regEventId = res.data.map(event => event._id);
          this.props.updateRegisteredEvents(regEventId);
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
    return (
      <Container>
        <Row>
          <SectionTitle sectionTitle={"Registered Events"} />
        </Row>
        {this.state.isLoading && <DashboardSpinner />}
        {!this.state.isLoading && (
          <RegisteredEventCards
            myEvents={this.state.myEvents}
            setLoginState={this.state.setLoginState}
            eventDescriptionPageHandler={this.eventDescriptionPageHandler}
          />
        )}
      </Container>
    );
  }
}

const DashboardSpinner = () => (
  <div className="dashboard-events-loader" data-testid="dashboard-events">
    <Spinner size="lg" color="primary" />
  </div>
);

const RegisteredEventCards = ({
  myEvents,
  setLoginState,
  eventDescriptionPageHandler,
}) => {
  if (myEvents && myEvents.length) {
    return myEvents
      .filter(event => moment.utc(event.time).toDate() - Date.now() > 0)
      .map(event => (
        <EventCard
          key={event._id}
          eventDetail={event}
          eventDescriptionPageHandler={eventDescriptionPageHandler}
          setLoginState={setLoginState}
          isRegistered={true}
          className={"is-registered"}
        />
      ));
  }
  return (
    <Row>
      <h3>No registered events.</h3>
    </Row>
  );
};

export default Dashboard;
