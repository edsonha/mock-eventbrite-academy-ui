import React from "react";
import UpcomingEvents from "./UpcomingEvents";
import CourseWrapper from "./CourseWrapper";
import SectionTitle from "./SectionTitle";
import axios from "axios";
import "../styles/LandingPage.css";
import { Container, Row, Spinner } from "reactstrap";

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.backendURI = props.backendURI;
    this.state = {
      courses: [],
      levels: ["basic", "intermediate", "advanced", "electives"],
      isLoading: true,
      errorLoading: false
    };
  }

  async componentDidMount() {
    await axios
      .get(this.backendURI + "/courses")
      .then(res => {
        this.setState({
          courses: res.data,
          isLoading: false,
          errorLoading: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false, errorLoading: true });
      });
  }

  render() {
    const { levels, courses } = this.state;
    const courseWrappers = levels.map(level => (
      <CourseWrapper key={level} level={level} courses={courses} />
    ));

    return (
      <div>
        <div className="title-banner">
          <h1>Personal Finance Course on Your Terms</h1>
        </div>

        <Container className="stashaway-academy-description">
          <p>
            We understand that managing your personal finances can be a daunting
            task. With so many topics to cover such as retirement, budgeting and
            investing your wealth, it can be very confusing for those who have
            no proper guidance.
          </p>

          <p>
            At StashAway, we have set up our very own academy in order to share
            our knowledge with people like you: those who want to take control
            of their finances. We provide education and training programmes for
            beginners, intermediate learners, and even professionals.
          </p>
        </Container>

        <Container className="curriculum">
          <Row>
            <SectionTitle sectionTitle={"Stashaway Academy Curriculum"} />
          </Row>
          <h5 className="curriculum-description">
            Start from the beginning and build your way up, or pick and choose
            the courses that you feel you need.
          </h5>
        </Container>

        {this.state.isLoading && (
          <div className="courses-spinner">
            <Spinner size="lg" color="primary" />
          </div>
        )}

        {this.state.errorLoading && (
          <h3 className="cannot-find-courses">
            Could not find courses. Please try again later
          </h3>
        )}

        {!this.state.isLoading && !this.state.errorLoading && (
          <Container>{courseWrappers}</Container>
        )}

        <UpcomingEvents
          backendURI={this.props.backendURI}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default LandingPage;
