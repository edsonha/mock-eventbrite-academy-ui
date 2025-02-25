import React from "react";
import { Col } from "reactstrap";
import "../styles/Course.css";

function Course(props) {
  const courseObjectives = props.details.objectives.map(objective => (
    <li className="course-objective" key={objective}>
      {objective}
    </li>
  ));

  return (
    <Col xs="12" sm="6" className="course-details">
      <h5 className="course-name">{props.details.title}</h5>
      <p className="course-description">{props.details.description}</p>
      <h5 className="objective-header">{props.details.objectiveHeader}</h5>
      <ul>{courseObjectives}</ul>
    </Col>
  );
}

export default Course;
