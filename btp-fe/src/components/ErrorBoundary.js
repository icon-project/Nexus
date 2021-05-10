/* eslint-disable */
import { Component } from "react";
import { Link, Redirect } from "@reach/router";
import { css } from "@emotion/react";

const errorBoundaryStyles = css`
  color: red;
`;

class ErrorBoundary extends Component {
  state = { hasError: false, redirect: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }

  componentDidUpdate() {
    const { hasError } = this.state;

    if (hasError) {
      setTimeout(() => this.setState({ redirect: true }), 5000);
    }
  }

  render() {
    const { hasError, redirect } = this.state;
    const { children } = this.props;

    if (redirect) {
      return <Redirect to="/" noThrow />;
    }

    if (hasError) {
      return (
        <h5 css={errorBoundaryStyles}>
          There was an error. <Link to="/">Click here</Link> to go back to the
          home page or wait five seconds.
        </h5>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
