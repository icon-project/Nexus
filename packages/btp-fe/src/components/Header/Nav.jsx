import React from 'react';
import styled from 'styled-components';

const NavStyled = styled.ul`
  display: flex;
  flex-flow: nowrap;
  /* margin-left: 32.5px; */
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto 0 32.5px;
  li {
    button {
      background-color: transparent;
      font-family: Poppins;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      padding: 8px 16px;
      border-radius: 4px;
      margin-right: 4px;
      &:focus,
      :hover {
        background-color: #28262f;
      }
    }
    &:last-child {
      margin-right: 0;
    }
  }
`;

const buttonContents = [
  { text: 'Transfer', effect: null },
  { text: 'Overview', effect: null },
  { text: 'Network', effect: null },
  { text: 'Governance', effect: null },
  { text: 'Auction', effect: null },
];
const Button = ({ text, onClick }) => {
  return (
    <li>
      <button onClick={onClick} active>
        {text}
      </button>
    </li>
  );
};

const Nav = () => {
  const handleClick = (e) => {
    e.preventDefault();
  };
  return (
    <NavStyled>
      {buttonContents.map((e) => (
        <Button key={e.text} text={e.text} onClick={e.effect || handleClick} />
      ))}
    </NavStyled>
  );
};

export default Nav;
