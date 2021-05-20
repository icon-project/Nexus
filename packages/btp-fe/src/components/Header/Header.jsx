import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Avatar } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Nav from './Nav';
import { Modal } from '../NotificationModal';

import { useDispatch, useSelect } from '../../hooks/useRematch';
import { requestAddress } from '../../connectors/ICONex/events';
import { wallets } from '../../utils/constants';
import { currentICONexNetwork } from '../../connectors/constants';

import defaultAvatar from '../../assets/images/avatar.svg';
import MetaMask from '../../assets/images/metal-mask.svg';
import ICONex from '../../assets/images/icon-ex.svg';
import closeIcon from '../../assets/images/close-icon.svg';
import copyIcon from '../../assets/images/copy-icon.svg';

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
  letter-spacing: 1px;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  svg {
    pointer-events: none;
  }
  .close-btn {
    background: url('${closeIcon}') !important;
    width: 18px !important;
    height: 18px !important;
    background-repeat: no-repeat !important;
    justify-self: end;
    align-self: center;
  }
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
      cursor: pointer;
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
    min-height: 100vh;
    width: 100%;
    position: fixed;
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
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
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
  .connect-a-wallet-detail {
    width: 480px;
    height: 564px;
    background: #1d1b22;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
      width: auto;
      height: auto;
      background-color: transparent;
    }
    h6 {
      color: #eff1ed;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.75px;
      margin-bottom: 42px;
    }
    h4 {
      display: grid;
      grid-template-columns: 20% 60% 20%;
      margin-bottom: 10px;
      span {
        grid-column: 2;
        text-align: center;
      }
      button {
        grid-column: 3;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 18px;
        margin: 0;
      }
    }
    .wallet-balance {
      width: 100%;
      height: 60px;
      display: grid;
      grid-template: 50% 50 / 50% 50%;
      padding: 0 32px;
      margin-top: 20px;
      margin-bottom: 20px;
      span:first-of-type {
        justify-self: start;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.75px;
        color: #85838e;
      }
      span {
        justify-self: end;
        font-weight: 600;
        font-size: 25px;
        line-height: 36px;

        text-align: right;
        letter-spacing: 1px;
      }
      span:last-of-type {
        grid-column: 2/3;
        grid-row: 2/3;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.75px;
        color: #85838e;
      }
    }
    .wallet-address {
      width: 100%;
      height: 60px;
      display: grid;
      grid-template: 50% 50 / 50% 50%;
      padding: 0 32px;
      margin-bottom: 20px;
      span:first-of-type {
        justify-self: start;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.75px;
        color: #85838e;
      }
      span {
        justify-self: end;
      }
      .copy-address {
        cursor: pointer;
        grid-column: 2/3;
        grid-row: 2/3;
        color: #7fdeff;
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        letter-spacing: 0.75px;
        margin: 0;
        justify-self: end;
        &:active {
          color: #4e8da2;
        }
        img {
          margin-right: 4.67px;
        }
      }
    }
    .nav-button {
      margin-top: auto;
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      padding: 0 26px;
      button:first-of-type {
        color: #99a3ff;
        width: 192px;
        height: 64px;
        border-radius: 4px;
        border: solid 1px #99a3ff;
        background-color: transparent;
      }
      button {
        font-size: 16px;
        line-height: 24px;
        text-align: center;
        letter-spacing: 1px;
        width: 192px;
        height: 64px;
        border-radius: 4px;
        background-color: #5465ff;
      }
    }
  }
`;

const hashShortener = (hashStr) => {
  const len = hashStr.length;
  if (len <= 10) {
    return hashStr;
  }

  return `${hashStr.substring(0, 6)}...${hashStr.substring(len - 4)}`;
};

const defaultUser = {
  id: 'test',
  userName: '@dsng',
  authorized: false,
  avatar: defaultAvatar,
};
const mockWallets = {
  metamask: {
    id: 'metamask',
    title: 'MetaMask Wallet',
    network: 'Etherum Mainnet',
    hash: '123afx123afa4aweasdfasdf',
    amount: 10,
    unit: 'ETH',
    icon: MetaMask,
  },
  iconex: {
    id: 'iconex',
    title: 'ICONex Wallet',
    network: 'Etherum Mainnet',
    hash: '123afx123afa4aweasdfasdf',
    amount: 10,
    unit: 'ETH',
    icon: ICONex,
  },
};

const WalletSelector = ({ type, active, onClick }) => {
  return (
    <button
      id={mockWallets[type].id}
      className="wallet-selector"
      autoFocus={active}
      onClick={onClick}
    >
      <Avatar src={mockWallets[type].icon} size={30} />
      <span className="wallet-title">{mockWallets[type].title}</span> {active && <CheckOutlined />}
    </button>
  );
};

const Header = ({ userStatus = defaultUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('metamask');
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const {
    accountInfo: { address, balance, unit },
  } = useSelect(({ account }) => ({
    accountInfo: account.selectAccountInfo,
  }));

  const { openModal, setDisplay, resetAccountInfo } = useDispatch(
    ({ modal: { openModal, setDisplay }, account: { resetAccountInfo } }) => ({
      openModal,
      setDisplay,
      resetAccountInfo,
    }),
  );

  const toggleModal = () => {
    setShowModal((prev) => !prev);
    setShowDetail(false);
  };
  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (e.target.id == 'start-connect') {
      if (selectedWallet === wallets.iconex) {
        const hasAccount = await requestAddress();

        if (!hasAccount) {
          setLoading(false);
        }
      }
    }
  };
  const handleSelectWallet = (e) => {
    e.preventDefault();
    setSelectedWallet(e.target.id);
  };

  const onDisconnectWallet = () => {
    resetAccountInfo();
    toggleModal();
  };

  const onSwitchWallet = () => {
    setShowDetail(false);
  };

  const onAvatarClicked = () => {
    setShowDetail(true);
    setShowModal(true);
  };

  useEffect(() => {
    if (address) {
      setLoading(false);
      setShowDetail(true);
    }
  }, [address]);

  return (
    <StyledHeader>
      {showModal && (
        <div className="connect-a-wallet-modal">
          {loading ? (
            <Modal icon="loader" desc="Please wait a moment." width="352px" display />
          ) : showDetail ? (
            <div className="connect-a-wallet-detail">
              <h4>
                <span>{mockWallets[selectedWallet].title}</span>
                <button id="close-detail" className="close-btn" onClick={toggleModal} />
              </h4>
              <h6>{currentICONexNetwork.name}</h6>
              <Avatar className="user-avatar" src={userStatus.avatar} size={120} />
              <div className="wallet-balance">
                <span>Balance</span>
                <span>{`${balance} ${unit}`}</span>
                <span> = $98.22 USD</span>
              </div>
              <div className="wallet-address">
                <span>Wallet Address</span>
                <span title={address}>{hashShortener(address)}</span>
                <CopyToClipboard text={address}>
                  <span className="copy-address">
                    <img src={copyIcon} />
                    Copy address
                  </span>
                </CopyToClipboard>
              </div>
              <div className="nav-button">
                <button onClick={onDisconnectWallet}>Disconnect wallet</button>
                <button onClick={onSwitchWallet}>Switch wallet</button>
              </div>
            </div>
          ) : (
            <div className="connect-a-wallet-card">
              <h4>
                <span className="card-title">Connect a wallet</span>
                <button className="close-btn" onClick={toggleModal} />
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
              <button id="start-connect" onClick={handleConnect}>
                Connect a Wallet
              </button>
            </div>
          )}
        </div>
      )}
      <div
        className="left-side"
        onClick={() =>
          openModal({
            icon: 'checkIcon',
            desc: 'Your transaction was submitted successfully.',
            button: {
              text: 'Continue transfer',
              onClick: () => setDisplay(false),
            },
          })
        }
      >
        BTP Dashboard
      </div>
      <Nav />
      {address ? (
        <div className="right-side">
          <span className="wallet-name">{currentICONexNetwork.name}</span>
          <Avatar
            className="user-avatar"
            src={userStatus.avatar}
            size={48}
            onClick={onAvatarClicked}
          />
          <span className="wallet-nfo">
            <span>{hashShortener(address)}</span>
            <br />
            <span className="currency-ctn">
              <span>{balance}</span>
              <span className="unit">{unit}</span>
            </span>
          </span>
        </div>
      ) : (
        <button className="connect-to-wallet-btn" onClick={toggleModal}>
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
