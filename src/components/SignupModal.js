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
import MessageBox from "./MessageBox";
import axios from "axios";
import "../styles/SignupModal.css";

class SignupModal extends React.Component {
  constructor(props) {
    super(props);
    this.backendURI = props.backendURI;
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      result: "",
      messageBoxIsOpen: false
    };
  }

  onChange = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({ [name]: value });
  };

  clearInput = () => {
    this.setState({
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      result: "",
      messageBoxIsOpen: false
    });
  };

  userRegister = async () => {
    const { name, email, password, passwordConfirmation } = this.state;
    await axios
      .post(this.backendURI + "/users/register", {
        name,
        email,
        password,
        passwordConfirmation
      })
      .then(res => {
        this.setState({
          result: res.data.message,
          messageBoxIsOpen: true
        });
        if (res.data.message === "Account created!") {
          sessionStorage.setItem("JWT", res.data.jwtToken);
          this.props.setLoginState(true);
          this.clearInput();
          this.props.showSignupModal(false);
        }
      })
      .catch(err => {
        this.setState({
          result: err.response.data.message,
          messageBoxIsOpen: true
        });
      });
  };

  render() {
    const closeBtn = (
      <button
        className="close"
        onClick={() => {
          this.clearInput();
          this.props.showSignupModal(false);
        }}
      >
        &times;
      </button>
    );

    return (
      <div>
        {this.props.isOpen && (
          <Modal isOpen={this.props.isOpen} id="signup-form">
            <ModalHeader
              toggle={this.props.signupModalToggle}
              close={closeBtn}
              id="signup-header"
              data-testid="signup-header"
            >
              Sign Up
            </ModalHeader>
            <ModalBody id="signup-body">
              <MessageBox
                color="danger"
                isOpen={this.state.messageBoxIsOpen}
                message={this.state.result}
              />
              <Row className="signup-form-row">
                <Label
                  id="signup-name-input-label"
                  for="signup-name-input"
                  sm={2}
                >
                  Name
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="name"
                    id="signup-name-input"
                    placeholder="username"
                    value={this.state.name}
                    onChange={this.onChange}
                  />
                </Col>
              </Row>
              <Row className="signup-form-row">
                <Label
                  id="signup-email-input-label"
                  for="signup-email-input"
                  sm={2}
                >
                  E-mail
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="email"
                    id="signup-email-input"
                    placeholder="myemail@email.com"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </Col>
              </Row>
              <Row className="signup-form-row">
                <Label
                  id="signup-password-input-label"
                  for="signup-password-input"
                  sm={2}
                >
                  Password
                </Label>
                <Col sm={10}>
                  <Input
                    type="password"
                    name="password"
                    id="signup-password-input"
                    placeholder="********"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                </Col>
              </Row>
              <Row className="signup-form-row-pcfm">
                <Label
                  id="signup-password-cfm-input-label"
                  for="signup-password-cfm-input"
                  sm={2}
                >
                  Confirm Password
                </Label>
                <Col sm={10}>
                  <Input
                    type="password"
                    name="passwordConfirmation"
                    id="signup-password-cfm-input"
                    placeholder="********"
                    value={this.state.passwordConfirmation}
                    onChange={this.onChange}
                  />
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter id="signup-footer-content">
              <div className="login-reminder">
                Already have an account?
                <button
                  onClick={() => {
                    this.clearInput();
                    this.props.showSignupModal(false);
                    this.props.showLoginModal(true);
                  }}
                >
                  Log In!
                </button>
              </div>
              <div className="signup-modal-footer-btn">
                <Button
                  className="cancel-btn"
                  onClick={() => {
                    this.props.showSignupModal(false);
                    this.clearInput();
                  }}
                >
                  Cancel
                </Button>
                <Button className="go-btn" onClick={this.userRegister}>
                  Go!
                </Button>
              </div>
            </ModalFooter>
          </Modal>
        )}
      </div>
    );
  }
}

export default SignupModal;
