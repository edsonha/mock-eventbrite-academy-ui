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
import "../styles/EventCard.css";

const EventCard = props => {
  return (
    <Col xs="12" sm="6">
      <Card className="event-card">
        <div className="event-card-header">
          <CardTitle className="event-card-header-text">
            {props.eventDetail.title}
          </CardTitle>
          <img
            src={props.eventDetail.image || "/eventDefault2.png"}
            alt="Event"
            className="event-card-img"
            data-testid="event-image"
            onClick={() =>
              props.eventDescriptionPageHandler(props.eventDetail._id)
            }
          />
        </div>
        <div className="event-card-details">
          <div className="event-desc">
            <CardText>{props.eventDetail.description}</CardText>
          </div>
          <CardSubtitle>{props.eventDetail.speaker}</CardSubtitle>
          <CardSubtitle>
            {moment
              .parseZone(props.eventDetail.time)
              .format("ddd, MMM Do YYYY, h:mm a") +
              " (" +
              minToHour(props.eventDetail.duration) +
              ")"}
          </CardSubtitle>
          <CardSubtitle>{props.eventDetail.location}</CardSubtitle>
        </div>
        <div className="event-card-button">
          <Button
            className="register-button"
            data-testid="event-learnmore"
            onClick={() =>
              props.eventDescriptionPageHandler(props.eventDetail._id)
            }
          >
            Learn More
          </Button>
          <Button className="register-button">Register</Button>
        </div>
      </Card>
    </Col>
  );
};

export default EventCard;
