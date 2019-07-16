import React from "react";
import "../styles/SectionTitle.css";

function SectionTitle(props) {
  return (
    <React.Fragment>
      <h1 className="section-title">{props.sectionTitle}</h1>
    </React.Fragment>
  );
}

export default SectionTitle;
