import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { smallBoldSubtitle } from '../Typography/SubTitle';
import { colors } from '../Styles/Colors';

const NavStyled = styled.ul`
  display: flex;
  flex-flow: nowrap;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto 0 32.5px;

  li {
    a.active {
      .nav-link {
        background-color: ${colors.brandSecondaryBase};
      }
    }

    .nav-link {
      ${smallBoldSubtitle}

      background-color: transparent;

      padding: 8px 16px;
      border-radius: 4px;
      margin-right: 4px;
      color: ${colors.brandSecondaryBG};

      &:focus,
      :hover {
        background-color: ${colors.brandSecondaryBase};
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
const Button = ({ text }) => {
  return (
    <li>
      <NavLink to={`/${text.toLowerCase()}`}>
        <button className="nav-link">{text}</button>
      </NavLink>
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
