import React from "react";
import axios from "axios";
import { minToHour } from "../helper/minToHour";
import moment from "moment";
import { Container } from "reactstrap";
import "../styles/EventDescriptionPage.css";

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
      const {
        title,
        description,
        speaker,
        time,
        duration,
        location,
        availableSeats,
        image
      } = this.state.eventDescription;
      return (
        <div data-testid="event-description-page">
          <div className="container">
            <div
              className="jumbotron"
              style={{
                backgroundImage: `url(
                  ${image || "/eventDefault.png"}
                )`
              }}
            >
              <div className="banner-title">
                <h1>{title}</h1>
              </div>
              <div className="banner-description">
                <p>{description}</p>
              </div>
            </div>
          </div>
          <Container className="container-below-jumbtron">
            <div className="event-full-description">
              <p>FULL DESCRIPTION</p>
              <p>Speaker Bio: {speaker}</p>
            </div>
            <div className="event-detail-summary">
              <p>{location}</p>
              <p>
                {" "}
                {moment.parseZone(time).format("ddd, MMM Do YYYY, h:mm a") +
                  " (" +
                  minToHour(duration) +
                  ")"}
              </p>
              <p>Available Seats: {availableSeats}</p>
            </div>
          </Container>
        </div>
      );
    }
  }
}

export default EventDescriptionPage;
