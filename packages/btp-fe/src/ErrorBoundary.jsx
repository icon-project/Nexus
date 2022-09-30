import React from 'react';
import styled from 'styled-components/macro';
import NotFoundPage from 'containers/NotFoundPage';

import { colors } from 'components/Styles/Colors';

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: ${colors.grayDark};
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.log('Uncatch error: ', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Wrapper>
          <NotFoundPage />
        </Wrapper>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
