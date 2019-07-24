import React from "react";
import Course from "./Course";
import { Button, Row, Container, Col } from "reactstrap";
import "../styles/CourseWrapper.css";

function CourseWrapper(props) {
  const filteredAndMappedCourses = props.courses
    .filter(course => course.level.toLowerCase() === props.level.toLowerCase())
    .map(fcourse => {
      return <Course key={fcourse._id} details={fcourse} />;
    });

  return (
    <div className="course-wrapper">
      <Col>
        <Button className="see-events-btn" href="#upcoming-events">
          See All Upcoming Events
        </Button>
      </Col>
      <h5 id={props.level} className="course-title">
        {props.level === "electives"
          ? "Electives"
          : props.level[0].toUpperCase() +
            props.level.substring(1) +
            " Courses"}
      </h5>
      <Container>
        <Row>{filteredAndMappedCourses}</Row>
      </Container>
    </div>
  );
}

export default CourseWrapper;
