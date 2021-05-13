import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Logo } from '../Logo';
import { media } from '../Styles/Media';

const StyledBrand = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  background-color: ${(props) => props.bgColor};
  width: 100%;
  h1 {
    display: ${({ collapsed }) => (collapsed ? 'none' : 'block')};
    height: 32px;
    max-width: 100%;

    margin: 0 0 0 12px;
    color: ${(props) => props.color};
    font-weight: 600;
    font-size: 1.8rem;
    line-height: 32px;
    vertical-align: middle;
  }
  ${media.lg`
    h1 {
      display: inline-block;
    }
  `}
`;

const Brand = ({ brandName, bgColor, color, collapsed }) => {
  return (
    <StyledBrand className="logo" bgColor={bgColor} color={color} collapsed={collapsed}>
      <Logo>
        <h1>{brandName}</h1>
      </Logo>
    </StyledBrand>
  );
};

Brand.propTypes = {
  brandName: PropTypes.string,
  bgColor: PropTypes.string,
  color: PropTypes.string,
};

Brand.defaultProps = {
  brandName: '',
  bgColor: '#00152a',
  color: '#fff',
};

export default Brand;
