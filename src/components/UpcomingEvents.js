import React from "react";
import EventCard from "./EventCard";
import uuid from "uuid";

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
      const eventCards = this.state.upcomingEvents
        .filter(event => {
          const offsetInMilliSec = new Date().getTimezoneOffset() * 60 * 1000;
          const timeDiffInMinutes =
            (event.time.toDate() - Date.now() + offsetInMilliSec) / 1000 / 60;
          return timeDiffInMinutes > 0;
        })
        .map(event => <EventCard key={uuid()} eventDetail={event} />);
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
