import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Col,
  Input,
  Row
} from "reactstrap";
import "../styles/LoginModal.css";
import axios from "axios";

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.backendURI = props.backendURI;
    this.state = {
      email: "",
      password: ""
    };
  }

  onChange = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({ [name]: value });
  };

  clearInput = () => {
    this.setState({ email: "", password: "" });
  };

  userLogin = async () => {
    await axios
      .post(this.backendURI + "/users/login", {
        email: this.state.email,
        password: this.state.password
      })
      .then(res => {
        this.props.setUsername(res.data.name);
        this.props.setLoginState(true);
        this.props.showLoginModal(false);
        sessionStorage.setItem("JWT", res.data.jwtToken);
      })
      .catch(err => {
        console.log(err.response.data.message);
      });
  };

  render() {
    const closeBtn = (
      <button
        className="close"
        onClick={() => {
          this.clearInput();
          this.props.showLoginModal(false);
        }}
      >
        &times;
      </button>
    );

    return (
      <div>
        {this.props.isOpen && (
          <div data-testid="login-modal">
            <Modal isOpen={this.props.isOpen} id="login-content">
              <ModalHeader
                toggle={this.props.modalToggle}
                close={closeBtn}
                id="login-header"
              >
                Log In
              </ModalHeader>
              <ModalBody id="login-body">
                <Row>
                  <Label id="email-input-label" for="email-input" sm={2}>
                    E-mail
                  </Label>
                  <Col sm={10}>
                    <Input
                      type="email"
                      name="email"
                      id="email-input"
                      placeholder="myemail@email.com"
                      value={this.state.email}
                      onChange={this.onChange}
                    />
                  </Col>
                </Row>
                <Row>
                  <Label id="password-input-label" for="password-input" sm={2}>
                    Password
                  </Label>
                  <Col sm={10}>
                    <Input
                      type="password"
                      name="password"
                      id="password-input"
                      placeholder="********"
                      value={this.state.password}
                      onChange={this.onChange}
                    />
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter id="login-footer-content">
                <div className="signup-reminder">
                  Don't have an account yet?
                  <button
                    onClick={() => {
                      this.props.showSignupModal(true);
                      this.props.showLoginModal(false);
                    }}
                  >
                    Sign up!
                  </button>
                </div>
                <div className="login-modal-footer-btn">
                  <Button
                    className="cancel-btn"
                    onClick={() => this.props.showLoginModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="go-btn" onClick={this.userLogin}>
                    Go!
                  </Button>
                </div>
              </ModalFooter>
            </Modal>
          </div>
        )}
      </div>
    );
  }
}

export default LoginModal;
