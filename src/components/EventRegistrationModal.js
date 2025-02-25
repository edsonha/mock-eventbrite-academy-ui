import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { minToHour } from "../helper/minToHour";
import moment from "moment";
import "../styles/EventRegistrationModal.css";
import "./MessageBox";
import axios from "axios";
import MessageBox from "./MessageBox";

class EventRegistrationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      isMessageBoxOpen: false,
      message: ""
    };
  }

  async componentDidMount() {
    const jwt = await sessionStorage.getItem("JWT");
    if (jwt && !this.state.username) {
      await axios({
        method: "get",
        url: process.env.REACT_APP_REST_API_LOCATION + "/users/secure",
        headers: { Authorization: "Bearer " + jwt }
      })
        .then(res => {
          this.setState({
            username: res.data.name
          });
        })
        .catch(err => {
          this._authErrHandler(err);
        });
    }
  }

  _authErrHandler = err => {
    if (err.request.status === 401) {
      sessionStorage.removeItem("JWT");
      this.props.history.push("/");
    }
  };

  submitReservation = async () => {
    const jwt = sessionStorage.getItem("JWT");
    await axios({
      method: "post",
      url:
        process.env.REACT_APP_REST_API_LOCATION +
        "/upcomingevents/" +
        this.props.eventDetail._id +
        "/user/registerevent",
      headers: { Authorization: "Bearer " + jwt }
    })
      .then(postRes => {
        this.setState({ isMessageBoxOpen: true, message: "RSVP Successful" });
      })
      .then(async () => {
        await axios({
          method: "get",
          url:
            process.env.REACT_APP_REST_API_LOCATION +
            "/profile/registeredevents",
          headers: { Authorization: "Bearer " + jwt }
        }).then(getRes => {
          this.props.updateRegisteredEvents(getRes.data);
        });
      })
      .catch(err => {
        if (err.response && err.response.status === 422) {
          this.setState({ isMessageBoxOpen: true, message: "Event is full" });
        } else {
          this.setState({
            isMessageBoxOpen: true,
            message: "Please try again"
          });
          console.log("ERROR", err);
        }
      });
  };

  render() {
    const closeBtn = (
      <button
        className="close"
        onClick={() => {
          this.props.showEventRegistrationModal(false);
        }}
      >
        &times;
      </button>
    );

    const { title, time, location, duration } = this.props.eventDetail;
    return (
      <React.Fragment>
        {this.props.isOpen && (
          <div data-testid="event-registration-modal">
            <Modal isOpen={this.props.isOpen} id="event-registration-content">
              <ModalHeader close={closeBtn}>
                <p>{title}</p>
                <p>
                  {moment.parseZone(time).format("ddd, MMM Do YYYY, h:mm a") +
                    " (" +
                    minToHour(duration) +
                    ")"}
                </p>
                <p>{location}</p>
              </ModalHeader>
              <ModalBody>
                <p>{this.state.username}</p>
                {this.state.isMessageBoxOpen && (
                  <MessageBox
                    color={
                      this.state.message === "RSVP Successful"
                        ? "success"
                        : "danger"
                    }
                    data-testid="message-box"
                    isMessageBoxOpen={this.state.isMessageBoxOpen}
                    message={this.state.message}
                  />
                )}
              </ModalBody>
              {!this.state.isMessageBoxOpen && (
                <ModalFooter>
                  <Button
                    className="cancel-btn"
                    onClick={() => this.props.showEventRegistrationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="rsvp-btn" onClick={this.submitReservation}>
                    RSVP
                  </Button>
                </ModalFooter>
              )}
            </Modal>
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default EventRegistrationModal;
