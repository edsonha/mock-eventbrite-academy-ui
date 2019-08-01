import React from "react";
import axios from "axios";
import moment from "moment";
import EventCard from "./EventCard";
import "../styles/Dashboard.css";
import { Container, Row, Spinner } from "reactstrap";
import SectionTitle from "./SectionTitle";

class Dashboard extends React.Component {
  eventDescriptionPageHandler = id => {
    this.props.history.push("/event/" + id);
  };

  async componentDidMount() {
    this.checkJwt();
  }

  async componentDidUpdate() {
    this.checkJwt();
  }

  checkJwt = () => {
    const jwt = sessionStorage.getItem("JWT");

    if (!jwt) {
      this.props.history.push("/");
    }
  };

  render() {
    let registeredEvents = null;
    let historyEvents = null;
    if (this.props.registeredEvents) {
      registeredEvents = getUpcomingRegisteredEvents(
        this.props.registeredEvents
      );
      historyEvents = getHistoryEvents(this.props.registeredEvents);
    }
    return (
      <div>
        <EventCardSection
          title={"Registered Events"}
          myEvents={registeredEvents}
          eventDescriptionPageHandler={this.eventDescriptionPageHandler}
          isLoading={!registeredEvents}
          dataTestId={"registeredEventsSection"}
        />

        <EventCardSection
          title={"History Events"}
          myEvents={historyEvents}
          eventDescriptionPageHandler={this.eventDescriptionPageHandler}
          isLoading={!historyEvents}
          dataTestId={"historyEventsSection"}
        />
      </div>
    );
  }
}

const DashboardSpinner = ({ testId = "eventCard" }) => (
  <div className="dashboard-events-loader" data-testid={`${testId}-loader`}>
    <Spinner size="lg" color="primary" />
  </div>
);

const getUpcomingRegisteredEvents = events =>
  events.filter(event => moment.utc(event.time).toDate() - Date.now() > 0);

const getHistoryEvents = events =>
  events
    .filter(event => moment.utc(event.time).toDate() - Date.now() <= 0)
    .map(event => {
      event.isPastEvent = true;
      return event;
    });

const EventCardSection = ({
  myEvents,
  eventDescriptionPageHandler,
  isLoading,
  title,
  dataTestId = "eventCardSection",
}) => {
  const lowerCasedTitle = title.toLowerCase();
  let content = (
    <Row>
      <h3>{`No ${lowerCasedTitle}.`}</h3>
    </Row>
  );
  if (isLoading) {
    content = <DashboardSpinner testId={dataTestId} />;
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
    <Container data-testid={dataTestId}>
      <Row>
        <SectionTitle sectionTitle={title} />
      </Row>
      <Row>{content}</Row>
    </Container>
  );
};

export default Dashboard;
