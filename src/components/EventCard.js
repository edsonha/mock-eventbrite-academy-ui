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
    <Col xs="12" sm="4">
      <Card className="event-card">
        <img src={props.eventDetail.image} alt="Event" />
        <CardTitle>{props.eventDetail.title}</CardTitle>
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
        <Button className="register-button float-right">Register</Button>
      </Card>
    </Col>
  );
};

export default EventCard;
