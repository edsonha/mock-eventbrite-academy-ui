import React from "react";
import axios from "axios";

class EventDescriptionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventDescription: {},
      errorLoading: false
    };
  }

  async componentDidMount() {
    await axios
      .get(this.props.backendURI + `/upcomingevents/${this.props.eventId}`)
      .then(
        res => {
          this.setState({
            eventDescription: res.data
          });
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
        <div data-testid="event-description-page">
          <h3>Oops, something went wrong. Please try again later</h3>
        </div>
      );
    } else {
      return (
        <div data-testid="event-description-page">
          <h1>{this.state.eventDescription.title}</h1>
        </div>
      );
    }
  }
}

export default EventDescriptionPage;
