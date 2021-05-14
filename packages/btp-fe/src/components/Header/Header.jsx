import React, { useState } from 'react';
import styled from 'styled-components';
import { Layout, Avatar } from 'antd';
import PropTypes from 'prop-types';
import Nav from './Nav';
import { colors } from '../Styles/Colors';
import { Dropdown } from '../Dropdown';
import defaultAvatar from '../../assets/images/avatar.svg';

const StyledHeader = styled(Layout.Header)`
  height: 80px;
  width: 100%;
  padding: 0 160px 0 40.5px;
  /* color: ${colors.textColor}; */
  color: #fff;
  background-color: #131217;
  border-bottom: 1px solid #353242;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left-side {
    min-width: 175px;
    color: #99a3ff;
    font-family: Poppins;
    font-weight: 700;
    font-size: 21px;
    line-height: 28px;
  }
  .right-side {
    display: flex;
    align-items: center;
    min-width: 305px;
    margin-left: 80px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 100;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 1px;
    br {
      margin: 10px;
    }
    line-height: 0.8;
    display: flex;
    flex-wrap: nowrap;
    .user-avatar {
      margin-left: 20px;
    }
    .wallet-nfo {
      padding-top: 4px;
      margin-left: 8px;
    }
    .currency-ctn {
      display: inline-block;
      padding-top: 10px;
      font-weight: bold;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.75px;
      .unit {
        margin-left: 4px;
      }
    }
    .dropdown-hoverable {
      display: flex;
      flex-wrap: nowrap;
    }
  }
  .connect-to-wallet-btn {
    height: 44px;
    padding: 12px 16px;
    min-width: 170px;
    background: #5465ff;
    border-radius: 100px;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    letter-spacing: 1px;
  }
`;

const hashShortener = (hashStr) => {
  const len = hashStr.length;
  if (len <= 10) {
    return hashStr;
  }

  return `${hashStr.substring(0, 6)}...${hashStr.substring(len - 4)}`;
};

const defaultWallet = {
  id: 'demo',
  name: 'Etherum Mainnet',
  hash: '123afx123afa4aweasdfasdf',
  amount: 10,
  unit: 'ETH',
};

const defaultUser = {
  id: 'test',
  userName: '@dsng',
  authorized: false,
  avatar: defaultAvatar,
};

const Header = ({ items, userStatus = defaultUser, wallet = defaultWallet }) => {
  const [authorized, setAuthorized] = useState(false);
  const handleConnect = (e) => {
    e.preventDefault();
    setAuthorized((prev) => !prev);
  };
  window.testAuth = setAuthorized;
  return (
    <StyledHeader>
      <div className="left-side">BTP Dashboard</div>
      <Nav />
      {userStatus.authorized || authorized ? (
        <div className="right-side">
          <span className="wallet-name">{wallet.name}</span>
          <Dropdown items={items} fullWidthOnMobile handleLogout={handleConnect}>
            <div className="dropdown-hoverable">
              <Avatar className="user-avatar" src={userStatus.avatar} size={48} />
              <span className="wallet-nfo">
                <span>{hashShortener(wallet.hash)}</span>
                <br />
                <span className="currency-ctn">
                  <span>{wallet.amount}</span>
                  <span className="unit">{wallet.unit}</span>
                </span>
              </span>
            </div>
          </Dropdown>
        </div>
      ) : (
        <button className="connect-to-wallet-btn" onClick={handleConnect}>
          Connect a Wallet
        </button>
      )}
    </StyledHeader>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func,
  userName: PropTypes.string,
  items: PropTypes.array.isRequired,
};

export default Header;
