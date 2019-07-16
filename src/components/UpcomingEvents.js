import React from "react";
import EventCard from "./EventCard";
import SectionTitle from "./SectionTitle";
import uuid from "uuid";
import moment from "moment";
import { Container, Row } from "reactstrap";
import "../styles/UpcomingEvents.css";
import axios from "axios";

class UpcomingEvents extends React.Component {
  constructor(props) {
    super(props);
    this.backendURI = props.backendURI;
    this.state = {
      upcomingEvents: []
    };
  }

  async componentDidMount() {
    await axios.get(this.backendURI + "/upcomingevents").then(
      res => {
        if (res.status === 200) {
          console.log("RESPONSE DATA:", res.data);
          this.setState({ upcomingEvents: res.data });
        }
      },
      err => {
        console.log(err.message);
      }
    );
  }

  render() {
    console.log(this.state.upcomingEvents);
    if (this.state.upcomingEvents.length === 0) {
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
        .map(event => <EventCard key={uuid()} eventDetail={event} />);
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
