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
    this.state = { isLoading: true };
  }

  eventDescriptionPageHandler = id => {
    this.props.history.push("/event/" + id);
  };

  async componentDidMount() {
    const jwt = sessionStorage.getItem("JWT");
    if (jwt) {
      await axios({
        method: "get",
        url:
          process.env.REACT_APP_REST_API_LOCATION + "/profile/registeredevents",
        headers: { Authorization: "Bearer " + jwt },
      })
        .then(res => {
          this.setState({ isLoading: false });
        })
        .catch(err => {
          console.log(err.message);
          // if (err.status === 401) {
          //   sessionStorage.removeItem("JWT");
          //   this.props.history.push("/");
          // } else if (err.response === undefined) {
          //   console.log(err.message);
          // } else if (err.response.status === 401) {
          //   console.log("Error is 401: ", err.response);
          //   sessionStorage.removeItem("JWT");
          //   this.props.history.push("/");
          // }
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
          title={"Registered Events"}
          myEvents={getUpcomingRegisteredEvents(this.props.registeredEvents)}
          eventDescriptionPageHandler={this.eventDescriptionPageHandler}
          isLoading={this.state.isLoading}
          dataTestId={"registeredEventsSection"}
        />

        <EventCardSection
          title={"History Events"}
          myEvents={getHistoryEvents(this.props.registeredEvents)}
          eventDescriptionPageHandler={this.eventDescriptionPageHandler}
          isLoading={this.state.isLoading}
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
      {content}
    </Container>
  );
};

export default Dashboard;
