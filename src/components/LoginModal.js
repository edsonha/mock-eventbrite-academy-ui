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

const LoginModal = ({ toggle, isOpen }) => {
  const closeBtn = (
    <button className="close" onClick={toggle}>
      &times;
    </button>
  );

  return (
    <div data-testid="login-modal">
      <Modal isOpen={isOpen} toggle={toggle} id="login-content">
        <ModalHeader toggle={toggle} close={closeBtn} id="login-header">
          Log In
        </ModalHeader>
        <ModalBody id="login-body">
          <Row>
            <Label
              className="input-label"
              id="email-input-label"
              for="exampleEmail"
              sm={2}
            >
              Email
            </Label>
            <Col sm={10}>
              <Input
                type="email"
                name="email"
                id="email-input"
                placeholder="myemail@email.com"
              />
            </Col>
          </Row>
          <Row>
            <Label
              className="input-label"
              id="password-input-label"
              for="examplePassword"
              sm={2}
            >
              Password
            </Label>
            <Col sm={10}>
              <Input
                type="password"
                name="password"
                id="examplePassword"
                placeholder="********"
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="go-btn" onClick={toggle}>
            Go!
          </Button>{" "}
          <Button className="cancel-btn" color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default LoginModal;
