import React from "react";
import { Card, CardTitle, CardSubtitle, Button, CardText } from "reactstrap";
import EventCard from "./EventCard";

class UpcomingEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingEvents: this.props.upcomingEvents
    };
  }
  render() {
    if (this.state.upcomingEvents.length === 0) {
      return (
        <div data-testid="upcoming-events">
          <h1>Upcoming Events</h1>
          <h3>Stay tuned for new events.</h3>
        </div>
      );
    } else {
      const eventCards = this.state.upcomingEvents.map(
        event => <EventCard eventDetail={event} />
        // const eventCards = [];
        // this.state.upcomingEvents.map(event =>
        //   eventCards.push(<EventCard eventDetail={event} />)
      );
      return (
        <div data-testid="upcoming-events">
          <h1>Upcoming Events</h1>
          {eventCards}
        </div>
      );
    }
  }
}

export default UpcomingEvents;
