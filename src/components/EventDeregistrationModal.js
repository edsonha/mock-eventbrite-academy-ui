import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import { minToHour } from "../helper/minToHour";
import MessageBox from "./MessageBox";
import "../styles/EventDeregistrationModal.css";
import axios from "axios";

class EventDeregistrationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMessageBoxOpen: false,
      message: ""
    };
  }

  cancelReservation = async () => {
    const jwt = sessionStorage.getItem("JWT");
    await axios({
      method: "put",
      url:
        process.env.REACT_APP_REST_API_LOCATION +
        "/upcomingevents/" +
        this.props.eventDetail._id +
        "/user/deregisterevent",
      headers: { Authorization: "Bearer " + jwt }
    })
      .then(putRes => {
        this.setState({
          isMessageBoxOpen: true,
          message: "You have been deregistered from this Event"
        });
      })
      .catch(err => {
        this.setState({
          isMessageBoxOpen: true,
          message: "Please try again"
        });
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
        console.log("ERROR", err);
      });
  };

  render() {
    const closeBtn = (
      <button
        className="close"
        onClick={() => {
          this.props.showEventDeregistrationModal(false);
        }}
      >
        &times;
      </button>
    );

    const { title, time, location, duration } = this.props.eventDetail;
    return (
      <div data-testid="event-deregistration-modal">
        {this.props.isOpen && (
          <React.Fragment>
            <Modal isOpen={this.props.isOpen} id="event-deregistration-content">
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
                <p>Are you sure you can't attend this Event?</p>
                {this.state.isMessageBoxOpen && (
                  <MessageBox
                    color={
                      this.state.message ===
                      "You have been deregistered from this Event"
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
                    onClick={() =>
                      this.props.showEventDeregistrationModal(false)
                    }
                  >
                    No
                  </Button>
                  <Button
                    className="deregister-btn"
                    onClick={this.cancelReservation}
                  >
                    Yes
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

export default EventDeregistrationModal;
