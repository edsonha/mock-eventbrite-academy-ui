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
        description,
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
              <p>
                What’s the buzz about passive investing and ETFs really about?
                Well, approximately 95% of active fund managers globally
                UNDERPERFORM the market index, and so investors are looking for
                ways to improve their performance. Enter, Exchange-traded Funds
                (ETFs) and passive investing. Join StashAway Co-founder and CEO,
                Michele Ferrario, in this event before you head off to brunch,
                as he takes you through the world of ETFs and how you can use
                these investment vehicles to your advantage. By registering for
                this event, you are giving permission to receive occasional
                email communications from StashAway on our products, marketing
                and events. We promise to send only good stuff. However, if you
                ever wish to opt out, you can easily unsubscribe using the
                Unsubscribe feature included in the emails. We may also share
                your personal details with third parties in relation to
                conducting this seminar. This may include the event hosts to
                enable us to expedite your entry into the building. Your
                personal data will not be used for any other purposes.
              </p>
              <p>Speaker Bio: {speaker}</p>
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

          {/* <div className="container">
            <Col xs="12" sm="7">
              <img
                src={image || "/eventDefault.png"}
                alt="Event"
                className="event-desc-img"
              />
              { {image ? null : (
                <div className="banner-title">
                  <h1>{title}</h1>
                </div>
              )} }
            </Col>
            <Col xs="12" sm="5">
              <h5>{description}</h5>
            </Col>
          </div>
          <Container className="container-below-image">
            <div className="event-full-description">
              <h5>Description</h5>
              <p>
                What’s the buzz about passive investing and ETFs really about?
                Well, approximately 95% of active fund managers globally
                UNDERPERFORM the market index, and so investors are looking for
                ways to improve their performance. Enter, Exchange-traded Funds
                (ETFs) and passive investing. Join StashAway Co-founder and CEO,
                Michele Ferrario, in this event before you head off to brunch,
                as he takes you through the world of ETFs and how you can use
                these investment vehicles to your advantage. By registering for
                this event, you are giving permission to receive occasional
                email communications from StashAway on our products, marketing
                and events. We promise to send only good stuff. However, if you
                ever wish to opt out, you can easily unsubscribe using the
                Unsubscribe feature included in the emails. We may also share
                your personal details with third parties in relation to
                conducting this seminar. This may include the event hosts to
                enable us to expedite your entry into the building. Your
                personal data will not be used for any other purposes.
              </p>
              <p>Speaker Bio: {speaker}</p>
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
          </Container> */}
        </Container>
      );
    }
  }
}

export default EventDescriptionPage;
