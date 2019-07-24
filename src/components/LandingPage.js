import React from "react";
import UpcomingEvents from "./UpcomingEvents";
import CourseWrapper from "./CourseWrapper";
import axios from "axios";

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.backendURI = props.backendURI;
    this.state = {
      courses: [],
      levels: ["basic", "intermediate", "advanced", "electives"]
    };
  }

  async componentDidMount() {
    await axios
      .get(this.backendURI + "/courses")
      .then(res => {
        this.setState({ courses: res.data });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { levels, courses } = this.state;
    const courseWrappers = levels.map(level => (
      <CourseWrapper key={level} level={level} courses={courses} />
    ));

    return (
      <div>
        <h1>Personal Finance Course on Your Terms</h1>
        <h5>Stashaway Academy Curriculum</h5>
        {courseWrappers}
        <UpcomingEvents
          backendURI={this.props.backendURI}
          loginModalToggle={this.props.loginModalToggle}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default LandingPage;
