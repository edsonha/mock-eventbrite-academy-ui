import React from "react";
import { Card, CardTitle, CardSubtitle, Button, CardText } from "reactstrap";

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
      const eventCards = [];
      this.state.upcomingEvents.map(event =>
        eventCards.push(<EventCard eventDetail={event} />)
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

const EventCard = props => {
  return (
    <Card>
      <CardTitle>{props.eventDetail.title}</CardTitle>
      <CardText>{props.eventDetail.description}</CardText>
      <CardSubtitle>By: {props.eventDetail.speaker}</CardSubtitle>
      <CardSubtitle>On: {props.eventDetail.time}</CardSubtitle>
      <CardSubtitle>At: {props.eventDetail.location}</CardSubtitle>
      <Button>Register</Button>
    </Card>
  );
};

export default UpcomingEvents;
