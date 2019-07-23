import React from "react";
import axios from "axios";
import { minToHour } from "../helper/minToHour";
import moment from "moment";
import { Button, Container, Spinner } from "reactstrap";
import "../styles/EventDescriptionPage.css";

class EventDescriptionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventDescription: {},
      errorLoading: false,
      isLoading: true
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    await axios
      .get(this.props.backendURI + `/upcomingevents/${this.props.eventId}`)
      .then(
        res => {
          this.setState({
            eventDescription: res.data,
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
        <Container
          data-testid="event-description-page"
          className="upcoming-events-loader"
        >
          <Spinner size="lg" color="primary" />
        </Container>
      );
    } else if (this.state.errorLoading) {
      return (
        <div data-testid="event-description-page">
          <h3>Oops, something went wrong. Please try again later</h3>
        </div>
      );
    } else {
      const {
        title,
        speaker,
        speakerBio,
        description,
        fullDescription,
        time,
        duration,
        location,
        availableSeats,
        image
      } = this.state.eventDescription;
      return (
        <Container data-testid="event-description-page">
          <Container className="image-container">
            <div className="image-with-header">
              <img
                src={image || "/eventDefault.png"}
                alt="Event"
                className="event-desc-img"
              />
              {!image && (
                <div className="event-description-header-text">
                  <h1>{title}</h1>
                </div>
              )}
            </div>
            <div className="event-description-summary">
              <h5>{description}</h5>
            </div>
          </Container>

          <Container className="event-descriptions-detail">
            <div className="event-full-description">
              <h5>Description</h5>
              <p>{fullDescription}</p>
              <h5>About The Speaker</h5>
              <p>{speaker}</p>
              <p>{speakerBio}</p>
            </div>
            <div className="event-detail-summary">
              <h5>Date and Time</h5>
              <p>
                {" "}
                {moment.parseZone(time).format("ddd, MMM Do YYYY, h:mm a") +
                  " (" +
                  minToHour(duration) +
                  ")"}
              </p>
              <h5>Location</h5>
              <p>{location}</p>
              <p>Available Seats: {availableSeats}</p>
              <Button
                data-testid="register-button"
                className="register-button"
                onClick={this.props.loginModalToggle}
              >
                Register
              </Button>
            </div>
          </Container>
        </Container>
      );
    }
  }
}

export default EventDescriptionPage;
