import React from "react";

class UpcomingEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingEvents: props.upcomingEvents
    };
  }
  render() {
    if (this.state.upcomingEvents.length === 0) {
      return (
        <div data-testid="upcoming-events">
          <h1>Upcoming Events</h1>s<h3>Stay tuned for new events.</h3>
        </div>
      );
    } else {
      return (
        <div data-testid="upcoming-events">
          <h1>Upcoming Events</h1>
          <h3>What is your Plan B?</h3>
        </div>
      );
    }
  }
}

export default UpcomingEvents;
