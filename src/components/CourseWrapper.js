import React from "react";
import Course from "./Course";
import { Button } from "reactstrap";

function CourseWrapper(props) {
  const filteredAndMappedCourses = props.courses
    .filter(course => course.level.toLowerCase() === props.level.toLowerCase())
    .map(fcourse => {
      return <Course key={fcourse._id} details={fcourse} />;
    });

  return (
    <React.Fragment>
      <Button>See All Upcoming Events</Button>
      <h5>{props.level}</h5>
      <div>{filteredAndMappedCourses}</div>
    </React.Fragment>
  );
}

export default CourseWrapper;
