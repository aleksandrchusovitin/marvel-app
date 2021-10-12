import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
  state = {
    process: 'waiting',
  };

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
    this.setState({ process: 'error' });
  }

  render() {
    const { process } = this.state;
    const { children } = this.props;

    return (process === 'error') ? <ErrorMessage /> : children;
  }
}

export default ErrorBoundary;