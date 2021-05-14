import React, { useState } from 'react';
import styled from 'styled-components';
import { Layout, Avatar } from 'antd';
import PropTypes from 'prop-types';
import Nav from './Nav';
// import { colors } from '../Styles/Colors';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
// import { LanguageSwitcher } from '../LanguageSwitcher';

// import { media } from '../Styles/Media';
import { Dropdown } from '../Dropdown';
import defaultAvatar from '../../assets/images/profile-img.png';
import MetaMask from '../../assets/images/metal-mask.svg';
import ICONex from '../../assets/images/icon-ex.svg';

const StyledHeader = styled(Layout.Header)`
  font-family: Poppins;
  height: 80px;
  width: 100%;
  padding: 0 160px 0 40.5px;
  color: #eff1ed;
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
  .connect-a-wallet-modal {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 1px;
    h4 {
      color: #eff1ed;
      position: relative;
      width: 100%;
      display: grid;
      grid-template-columns: 20% 60% 20%;
      justify-content: center;
      padding: 0 32px;
      font-style: normal;
      font-weight: 600;
      font-size: 25px;
      /* line-height: 36px; */
      letter-spacing: 1px;
      color: #eff1ed;
      margin-top: 23px;
      margin-bottom: 31px;
      .card-title {
        grid-column: 2;
        text-align: center;
      }
      > button {
        width: auto;
        height: auto;
        background-color: transparent;
        grid-column: 3;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 18px;
        margin: 0;
      }
    }

    button {
      margin: auto 0 32px;
      width: 416px;
      height: 64px;
      background: #5465ff;
      border-radius: 4px;
    }
    .connect-a-wallet-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 480px;
      height: 370px;
      background: #1d1b22;
      border-radius: 4px;
      .wallet-selector {
        margin: 0 0 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        width: 416px;
        height: 72px;
        padding: 0 28.5px;
        background: transparent;
        color: #eff1ed;
        .wallet-title {
          margin-right: auto;
          margin-left: 13.3px;
          color: #eff1ed;
          letter-spacing: 0.75px;
        }
        span {
          grid-column: 3;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          font-size: 18px;
          color: #5ef38c;
        }
        &:hover,
        :focus {
          background: #312f39;
          border-radius: 4px;
        }
      }
    }
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(10px);
    z-index: 1;
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
const wallets = {
  metamask: {
    id: 'metamask',
    title: 'MetaMask Wallet',
    icon: MetaMask,
  },
  iconex: {
    id: 'iconex',
    title: 'ICONex Wallet',
    icon: ICONex,
  },
};

const WalletSelector = ({ type, active, onClick }) => {
  return (
    <button id={wallets[type].id} className="wallet-selector" autoFocus={active} onClick={onClick}>
      <Avatar src={wallets[type].icon} size={30} />
      <span className="wallet-title">{wallets[type].title}</span> {active && <CheckOutlined />}
    </button>
  );
};

const Header = ({ items, userStatus = defaultUser, wallet = defaultWallet }) => {
  const [authorized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('metamask');
  const handleConnect = (e) => {
    e.preventDefault();
    setShowModal(true);
  };
  const handleSelectWallet = (e) => {
    e.preventDefault();
    setSelectedWallet(e.target.id);
  };

  return (
    <StyledHeader>
      {showModal && (
        <div className="connect-a-wallet-modal">
          <div className="connect-a-wallet-card">
            <h4>
              <span className="card-title">Connect a wallet</span>
              <button onClick={() => void setShowModal(false)}>
                <CloseOutlined />
              </button>
            </h4>
            <WalletSelector
              type="metamask"
              active={selectedWallet == 'metamask'}
              onClick={handleSelectWallet}
            />
            <WalletSelector
              type="iconex"
              active={selectedWallet == 'iconex'}
              onClick={handleSelectWallet}
            />
            <button onClick={() => void console.log('wallet click')}>Connect a Wallet</button>
          </div>
        </div>
      )}
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

          {/* <LanguageSwitcher /> */}
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
