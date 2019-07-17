import React from "react";
import EventCard from "./EventCard";
import SectionTitle from "./SectionTitle";
import moment from "moment";
import { Container, Row } from "reactstrap";
import "../styles/UpcomingEvents.css";
import axios from "axios";

class UpcomingEvents extends React.Component {
  constructor(props) {
    super(props);
    this.backendURI = props.backendURI;
    this.state = {
      upcomingEvents: [],
      errorLoading: false
    };
  }

  eventDescriptionPageHandler = id => {
    this.props.history.push("/event/" + id);
  };

  async componentDidMount() {
    await axios.get(this.backendURI + "/upcomingevents").then(
      res => {
        this.setState({ upcomingEvents: res.data, errorLoading: false });
      },
      err => {
        console.log(err.message);
        this.setState({ errorLoading: true });
      }
    );
  }

  render() {
    if (this.state.errorLoading) {
      return (
        <div className="no-upcoming-events" data-testid="upcoming-events">
          <SectionTitle sectionTitle={"Upcoming Events"} />
          <h3>Oops, something went wrong. Please try again later</h3>
        </div>
      );
    } else if (this.state.upcomingEvents.length === 0) {
      return (
        <div className="no-upcoming-events" data-testid="upcoming-events">
          <SectionTitle sectionTitle={"Upcoming Events"} />
          <h3>Stay tuned for new events.</h3>
        </div>
      );
    } else {
      const eventCards = this.state.upcomingEvents
        .filter(event => {
          const timeDiffInMinutes =
            (moment.utc(event.time).toDate() - Date.now()) / 1000 / 60;
          return timeDiffInMinutes > 0;
        })
        .map(event => (
          <EventCard
            key={event._id}
            eventDetail={event}
            eventDescriptionPageHandler={this.eventDescriptionPageHandler}
          />
        ));

      return (
        <Container data-testid="upcoming-events">
          <Row>
            <SectionTitle sectionTitle={"Upcoming Events"} />
          </Row>
          <Row>{eventCards}</Row>
        </Container>
      );
    }
  }
}

export default UpcomingEvents;
