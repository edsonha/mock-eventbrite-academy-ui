import React from "react";

function Course(props) {
  const courseObjectives = props.details.objectives.map(objective => (
    <li key={objective}>{objective}</li>
  ));

  return (
    <React.Fragment>
      <h5>{props.details.title}</h5>
      <p>{props.details.description}</p>
      <h5>{props.details.objectiveHeader}</h5>
      <ul>{courseObjectives}</ul>
    </React.Fragment>
  );
}

export default Course;
