import React from "react";
import { Alert } from "reactstrap";

class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.message,
      visible: this.props.isOpen
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message) {
      this.setState({
        message: this.props.message,
        visible: this.props.isOpen
      });
    }
  }

  render() {
    return (
      <Alert color={this.props.color} isOpen={this.props.isOpen}>
        {this.state.message}
      </Alert>
    );
  }
}

export default MessageBox;
