import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
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

  render() {
    // const closeBtn = (
    //   <button
    //     className="close"
    //     onClick={() => {

    //       this.props.showLoginModal(false);
    //     }}
    //   >
    //     &times;
    //   </button>
    // );

    return (
      <div data-testid="event-registration-modal">
        {this.props.isOpen && (
          <Modal isOpen={this.props.isOpen}>
            <ModalHeader>{this.props.eventDetail.title}</ModalHeader>
            <ModalBody id="login-body">
              <p>{this.state.username}</p>
            </ModalBody>
            <ModalFooter id="login-footer-content">
              <Button>RSVP</Button>
            </ModalFooter>
          </Modal>
        )}
      </div>
    );
  }
}
export default EventRegistrationModal;
