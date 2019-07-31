import React from "react";
import {
  Card,
  CardTitle,
  CardSubtitle,
  Button,
  CardText,
  Col
} from "reactstrap";
import { minToHour } from "../helper/minToHour";
import moment from "moment";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import EventRegistrationModal from "./EventRegistrationModal";
import "../styles/EventCard.css";

class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginModalOpen: false,
      isSignupModalOpen: false,
      isEventRegistrationModalOpen: false
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

  checkLoginState = () => {
    const jwt = sessionStorage.getItem("JWT");
    if (jwt) {
      this.showEventRegistrationModal(true);
    } else {
      this.showLoginModal(true);
    }
  };

  render() {
    const {
      image,
      title,
      _id,
      description,
      speaker,
      time,
      duration,
      location
    } = this.props.eventDetail;
    return (
      <Col xs="12" md="6">
        <Card className={`event-card ${this.props.className}`}>
          <div className="event-card-header">
            {image ? null : (
              <CardTitle
                onClick={() => this.props.eventDescriptionPageHandler(_id)}
                className="event-card-header-text"
              >
                {title}
              </CardTitle>
            )}
            <img
              src={image || "/eventDefault.png"}
              alt="Event"
              className="event-card-img"
              data-testid="event-image"
              onClick={() => this.props.eventDescriptionPageHandler(_id)}
            />
          </div>
          <div className="event-card-details">
            <div className="event-desc">
              <CardText>{description}</CardText>
            </div>
            <CardSubtitle className="event-speaker">{speaker}</CardSubtitle>
            <CardSubtitle>
              {moment.parseZone(time).format("ddd, MMM Do YYYY, h:mm a") +
                " (" +
                minToHour(duration) +
                ")"}
            </CardSubtitle>
            <CardSubtitle>{location}</CardSubtitle>
          </div>
          <div className="event-card-button">
            <Button
              className="register-button"
              data-testid="event-learnmore"
              onClick={() => this.props.eventDescriptionPageHandler(_id)}
            >
              Learn More
            </Button>
            {this.props.isRegistered ? (
              <Button className="deregister-button">Deregister</Button>
            ) : (
              <Button
                className="register-button"
                onClick={this.checkLoginState}
              >
                Register
              </Button>
            )}

            <LoginModal
              isOpen={this.state.isLoginModalOpen}
              showLoginModal={this.showLoginModal}
              notFromRegisterBtn={false}
              showSignupModal={this.showSignupModal}
              updateRegisteredEvents={this.props.updateRegisteredEvents}
            />
            <SignupModal
              isOpen={this.state.isSignupModalOpen}
              showLoginModal={this.showLoginModal}
              showSignupModal={this.showSignupModal}
            />
            {this.state.isEventRegistrationModalOpen && (
              <EventRegistrationModal
                isOpen={this.state.isEventRegistrationModalOpen}
                eventDetail={{ ...this.props.eventDetail }}
                showEventRegistrationModal={this.showEventRegistrationModal}
                updateRegisteredEvents={this.props.updateRegisteredEvents}
              />
            )}
          </div>
        </Card>
      </Col>
    );
  }
}

export default EventCard;
