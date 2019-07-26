import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { minToHour } from "../helper/minToHour";
import moment from "moment";
import "../styles/EventRegistrationModal.css";
import axios from "axios";

class EventRegistrationModal extends React.Component {
  constructor(props) {
    super(props);
    this.backendURI = props.backendURI;
    this.state = {
      username: ""
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

  submitReservation = () => {
    this.props.showEventRegistrationModal(false);
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
            </ModalBody>
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
          </Modal>
        )}
      </div>
    );
  }
}
export default EventRegistrationModal;
