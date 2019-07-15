import React from "react";
import { Card, CardTitle, CardSubtitle, Button, CardText } from "reactstrap";
import { minToHour } from "../helper/minToHour";
import moment from "moment";
import "../styles/EventCard.css";

const EventCard = props => {
  return (
    <Card className="event-card">
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
  );
};

export default EventCard;
