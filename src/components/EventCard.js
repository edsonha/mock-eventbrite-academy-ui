import React from "react";
import { Card, CardTitle, CardSubtitle, Button, CardText } from "reactstrap";

const EventCard = props => {
  return (
    <Card>
      <CardTitle>{props.eventDetail.title}</CardTitle>
      <CardText>{props.eventDetail.description}</CardText>
      <CardSubtitle>By: {props.eventDetail.speaker}</CardSubtitle>
      <CardSubtitle>On: {props.eventDetail.time}</CardSubtitle>
      <CardSubtitle>At: {props.eventDetail.location}</CardSubtitle>
      <Button>Register</Button>
    </Card>
  );
};

export default EventCard;
