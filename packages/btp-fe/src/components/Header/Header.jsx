import React from 'react';
import styled from 'styled-components';
import { Layout, Avatar } from 'antd';
import PropTypes from 'prop-types';
import Nav from './Nav';
import { colors } from '../Styles/Colors';
import { BellOutlined } from '@ant-design/icons';
import { LanguageSwitcher } from '../LanguageSwitcher';

import { media } from '../Styles/Media';
import { Dropdown } from '../Dropdown';
import defaultAvatar from '../../assets/images/profile-img.png';

const StyledHeader = styled(Layout.Header)`
  padding: 0px;
  height: 80px;
  width: 100%;
  color: ${colors.textColor};
  background-color: #131217;
  border-bottom: 1px solid #353242;
  .admin-header-layout-side {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    background-color: #131217;
    .left-side,
    .right-side {
      display: flex;
      .admin-header-index-action {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 12px;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          background-color: rgba(0, 0, 0, 0.025);
        }
        .admin-avatar {
          margin: 20px 8px 20px 0;
        }
      }
    }
    .left-side {
      flex: 1 1 0%;
      height: 100%;
      .admin-header-index-action {
        padding: 0;
      }
    }
    .right-side {
      height: 100%;
      overflow: hidden;
    }
  }

  .btp-dashboard {
    color: #99a3ff;
    /* Header/X-Small/Bold */

    font-family: Poppins;
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 28px;
    /* identical to box height, or 133% */

    text-align: center;
    letter-spacing: 1px;
    margin-top: 26px;
    margin-left: 40.5px;
  }

  .anticon-menu-unfold {
    display: flex;
    align-items: center;
    margin-left: 16px;
    svg {
      width: 20px;
      height: 20px;
    }
  }

  ${media.md`
    .admin-header-layout-side {
      .left-side .admin-header-index-action {
        display: none;
      }
    }
    .anticon-menu-unfold {
      display: none;
    }
  `}
`;

const Header = ({ items, userName }) => {
  return (
    <StyledHeader>
      <div className="admin-header-layout-side">
        <div className="left-side">
          <span className="btp-dashboard">BTP Dashboard</span>
          <Nav />
        </div>
        <div className="right-side">
          <span className="admin-header-index-action">
            <BellOutlined />
          </span>
          <Dropdown items={items} fullWidthOnMobile>
            <span className="admin-header-index-action">
              <Avatar className="admin-avatar" src={defaultAvatar} size={24} />
              {userName}
            </span>
          </Dropdown>
          <LanguageSwitcher />
        </div>
      </div>
    </StyledHeader>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func,
  userName: PropTypes.string,
  items: PropTypes.array.isRequired,
};

export default Header;
