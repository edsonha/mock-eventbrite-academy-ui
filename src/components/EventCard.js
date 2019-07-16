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
    <Col xs="12" sm="6" md="4">
      <Card className="event-card">
        <div className="event-card-header">
          <CardTitle className="event-card-header-text">
            {props.eventDetail.title}
          </CardTitle>
          <img src={props.eventDetail.image} alt="Event" />
        </div>
        <div className="event-card-details">
          <CardText>{props.eventDetail.description}</CardText>
          <CardSubtitle>By: {props.eventDetail.speaker}</CardSubtitle>
          <CardSubtitle>
            On:{" "}
            {moment
              .parseZone(props.eventDetail.time)
              .format("dddd, MMMM Do YYYY, h:mm a")}
          </CardSubtitle>
          <CardSubtitle>
            Duration: {minToHour(props.eventDetail.duration)}
          </CardSubtitle>
          <CardSubtitle>At: {props.eventDetail.location}</CardSubtitle>
        </div>
        <div className="event-card-button">
          <Button className="register-button float-right">Register</Button>
        </div>
      </Card>
    </Col>
  );
};

export default EventCard;
