import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { LOGO_APP } from '../../utils/constants';

const LogoStyle = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${(props) => props.height};
  margin: 0 auto;
  img {
    display: inline-block;
    height: ${(props) => props.height};
    vertical-align: middle;
  }
`;

const Logo = ({ imageUrl, children, height }) => {
  return (
    <LogoStyle href="/" height={height}>
      <img src={imageUrl || LOGO_APP} alt="logo" />
      {children}
    </LogoStyle>
  );
};

Logo.propTypes = {
  imageUrl: PropTypes.string,
  height: PropTypes.string,
};

Logo.defaultProps = {
  height: '32px',
};

export default Logo;
