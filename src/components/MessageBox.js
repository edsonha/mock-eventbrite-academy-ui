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

  // closeMessageBox = () => {
  //   this.setState({ message: "", visible: false });
  // };

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
      <Alert
        className="message-box"
        isOpen={this.state.visible}
        toggle={this.closeMessageBox}
      >
        {this.state.message}
      </Alert>
    );
  }
}

export default MessageBox;
