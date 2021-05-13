import React from 'react';
import styled from 'styled-components';

const NavStyled = styled.div`
  display: inline-block;
  ul {
    visibility: inherit;
    margin-left: 32.5px;
    li {
      display: inline-block;
      margin-left: 4px;
      margin-top: 8px;
      line-height: 20px;
      button {
        font-size: 16px;
        color: #f4f4f6;
        background-color: transparent;
        padding: 8px 16px;
        border: none;
        text-align: center;
        border-radius: 4px;
        &.active {
          background-color: rgba(216, 216, 216, 0);
        }
        &:hover {
          background-color: #28262f;
        }
      }
      &:after {
        display: none;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

const Nav = () => {
  return (
    <NavStyled>
      <ul>
        <li>
          <button>Transfer</button>
        </li>
        <li>
          <button>Overview</button>
        </li>
        <li>
          <button>Network</button>
        </li>
        <li>
          <button>Governance</button>
        </li>
        <li>
          <button>Auction</button>
        </li>
      </ul>
    </NavStyled>
  );
};

export default Nav;
