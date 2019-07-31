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
    this.backendURI = props.backendURI;
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
        url: this.backendURI + "/users/secure",
        headers: { Authorization: "Bearer " + jwt }
      })
        .then(res => {
          this.setState({
            username: res.data.name
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  submitReservation = async () => {
    const jwt = sessionStorage.getItem("JWT");
    await axios({
      method: "post",
      url:
        this.backendURI +
        "/upcomingevents/" +
        this.props.eventDetail._id +
        "/user/registerevent",
      headers: { Authorization: "Bearer " + jwt }
    })
      .then(postRes => {
        this.setState({ isMessageBoxOpen: true, message: "RSVP Successful" });
      })
      .catch(err => {
        if (err.response && err.response.status === 422) {
          this.setState({ isMessageBoxOpen: true, message: "Event is full" });
        } else {
          this.setState({
            isMessageBoxOpen: true,
            message: "Please try again"
          });
        }
      })
      .then(async () => {
        await axios({
          method: "get",
          url: this.backendURI + "/user/registeredevents",
          headers: { Authorization: "Bearer " + jwt }
        }).then(getRes => {
          const regEventId = getRes.data.map(event => event._id);
          this.props.updateRegisteredEvents(regEventId);
        });
      })
      .catch(err => {
        console.log("ERROR", err);
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
      <div data-testid="event-registration-modal">
        {this.props.isOpen && (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </div>
    );
  }
}
export default EventRegistrationModal;
