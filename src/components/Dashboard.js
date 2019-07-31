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
      <div>
        <EventCardSection
          myEvents={getRegisteredEvents(this.state.myEvents)}
          eventDescriptionPageHandler={this.eventDescriptionPageHandler}
          isLoading={this.state.isLoading}
          title={"Registered Events"}
        />
      </div>
    );
  }
}

const DashboardSpinner = () => (
  <div className="dashboard-events-loader" data-testid="dashboard-events">
    <Spinner size="lg" color="primary" />
  </div>
);

const getRegisteredEvents = events =>
  events.filter(event => moment.utc(event.time).toDate() - Date.now() > 0);

const EventCardSection = ({
  myEvents,
  eventDescriptionPageHandler,
  isLoading,
  title,
}) => {
  const lowerCasedTitle = title.toLowerCase();
  let content = (
    <Row>
      <h3>{`No ${lowerCasedTitle}.`}</h3>
    </Row>
  );
  if (isLoading) {
    content = <DashboardSpinner />;
  } else if (myEvents && myEvents.length) {
    content = myEvents.map(event => (
      <EventCard
        key={event._id}
        eventDetail={event}
        eventDescriptionPageHandler={eventDescriptionPageHandler}
        isRegistered={true}
        className={"is-registered"}
      />
    ));
  }

  return (
    <Container>
      <Row>
        <SectionTitle sectionTitle={title} />
      </Row>
      {content}
    </Container>
  );
};

export default Dashboard;
