import React from "react";
import EventCard from "./EventCard";
import SectionTitle from "./SectionTitle";
import moment from "moment";
import { Container, Row, Spinner } from "reactstrap";
import "../styles/UpcomingEvents.css";
import axios from "axios";

class UpcomingEvents extends React.Component {
  constructor(props) {
    super(props);
    this.backendURI = props.backendURI;
    this.state = {
      upcomingEvents: [],
      errorLoading: false,
      isLoading: true
    };
  }

  eventDescriptionPageHandler = id => {
    this.props.history.push("/event/" + id);
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    await axios.get(this.backendURI + "/upcomingevents").then(
      res => {
        this.setState({
          upcomingEvents: res.data,
          errorLoading: false,
          isLoading: false
        });
      },
      err => {
        console.log(err.message);
        this.setState({ errorLoading: true, isLoading: false });
      }
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Container>
          <Row>
            <SectionTitle sectionTitle={"Upcoming Events"} />
          </Row>
          <div className="upcoming-events-loader" data-testid="upcoming-events">
            <Spinner size="lg" color="primary" />
          </div>
        </Container>
      );
    } else if (this.state.errorLoading) {
      return (
        <Container>
          <div className="no-upcoming-events" data-testid="upcoming-events">
            <Row>
              <SectionTitle sectionTitle={"Upcoming Events"} />
            </Row>
            <Row>
              <h3>Oops, something went wrong. Please try again later</h3>
            </Row>
          </div>
        </Container>
      );
    } else if (this.state.upcomingEvents.length === 0) {
      return (
        <Container>
          <div className="no-upcoming-events" data-testid="upcoming-events">
            <Row>
              <SectionTitle sectionTitle={"Upcoming Events"} />
            </Row>
            <Row>
              <h3>Stay tuned for new events.</h3>
            </Row>
          </div>
        </Container>
      );
    } else {
      const eventCards = this.state.upcomingEvents
        .filter(event => moment.utc(event.time).toDate() - Date.now() > 0)
        .map(event => (
          <EventCard
            key={event._id}
            eventDetail={event}
            eventDescriptionPageHandler={this.eventDescriptionPageHandler}
            loginModalToggle={this.props.loginModalToggle}
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
