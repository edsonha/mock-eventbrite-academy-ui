import React from "react";
import axios from "axios";
import { minToHour } from "../helper/minToHour";
import moment from "moment";
import { Button, Container, Spinner } from "reactstrap";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import EventRegistrationModal from "./EventRegistrationModal";
import EventDeregistrationModal from "./EventDeregistrationModal";
import "../styles/EventDescriptionPage.css";

class EventDescriptionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventDescription: {},
      errorLoading: false,
      isLoading: true,
      isLoginModalOpen: false,
      isSignupModalOpen: false,
      isEventRegistrationModalOpen: false,
      isEventDeregistrationModalOpen: false
    };
  }

  showLoginModal = isShown => {
    this.setState({ isLoginModalOpen: isShown });
  };

  showSignupModal = isShown => {
    this.setState({ isSignupModalOpen: isShown });
  };

  showEventRegistrationModal = isShown => {
    this.setState({ isEventRegistrationModalOpen: isShown });
  };

  showEventDeregistrationModal = isShown => {
    this.setState({ isEventDeregistrationModalOpen: isShown });
  };

  checkLoginState = () => {
    const jwt = sessionStorage.getItem("JWT");
    if (jwt) {
      this.showEventRegistrationModal(true);
    } else {
      this.showLoginModal(true);
    }
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    await axios
      .get(
        process.env.REACT_APP_REST_API_LOCATION +
          `/upcomingevents/${this.props.eventId}`
      )
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

  async componentDidUpdate(prevProps) {
    if (prevProps.registeredEvents !== this.props.registeredEvents) {
      await axios
        .get(
          process.env.REACT_APP_REST_API_LOCATION +
            `/upcomingevents/${this.props.eventId}`
        )
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
          <h3 className="something-went-wrong">
            Oops, something went wrong. Please try again later
          </h3>
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

      const isHistoryEvent = moment.utc(time).toDate() - Date.now() <= 0;

      let registration = <p className="history-event">EVENT ENDED</p>;

      if (!isHistoryEvent) {
        registration = (
          <div>
            <p>Available Seats: {availableSeats}</p>
            {this.props.isRegistered ? (
              <Button
                className="deregister-button"
                onClick={() => this.showEventDeregistrationModal(true)}
              >
                Deregister
              </Button>
            ) : availableSeats > 0 ? (
              <Button
                data-testid="register-button"
                className="register-button"
                onClick={this.checkLoginState}
              >
                Register
              </Button>
            ) : (
              <Button className="event-full-button">FULL</Button>
            )}
          </div>
        );
      }

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

              {registration}
              {this.state.isLoginModalOpen && (
                <LoginModal
                  isOpen={this.state.isLoginModalOpen}
                  showLoginModal={this.showLoginModal}
                  showSignupModal={this.showSignupModal}
                  notFromRegisterBtn={false}
                  updateRegisteredEvents={this.props.updateRegisteredEvents}
                />
              )}

              {this.state.isSignupModalOpen && (
                <SignupModal
                  isOpen={this.state.isSignupModalOpen}
                  showLoginModal={this.showLoginModal}
                  showSignupModal={this.showSignupModal}
                />
              )}

              {this.state.isEventRegistrationModalOpen && (
                <EventRegistrationModal
                  isOpen={this.state.isEventRegistrationModalOpen}
                  eventDetail={{ ...this.state.eventDescription }}
                  showEventRegistrationModal={this.showEventRegistrationModal}
                  updateRegisteredEvents={this.props.updateRegisteredEvents}
                  history={this.props.history}
                />
              )}
              {this.state.isEventDeregistrationModalOpen && (
                <EventDeregistrationModal
                  isOpen={this.state.isEventDeregistrationModalOpen}
                  eventDetail={{ ...this.state.eventDescription }}
                  showEventDeregistrationModal={
                    this.showEventDeregistrationModal
                  }
                  updateRegisteredEvents={this.props.updateRegisteredEvents}
                />
              )}
            </div>
          </Container>
        </Container>
      );
    }
  }
}

export default EventDescriptionPage;
