import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from '../../hooks/useRematch';
import { Layout, Avatar } from 'antd';
import PropTypes from 'prop-types';
import Nav from './Nav';
// import { colors } from '../Styles/Colors';
import { CheckOutlined, CloseOutlined, CopyOutlined } from '@ant-design/icons';
// import { LanguageSwitcher } from '../LanguageSwitcher';

// import { media } from '../Styles/Media';
import { Dropdown } from '../Dropdown';
import defaultAvatar from '../../assets/images/avatar.svg';
import MetaMask from '../../assets/images/metal-mask.svg';
import ICONex from '../../assets/images/icon-ex.svg';
import Circle from '../../assets/images/loading-eclipse.svg';

const SpinSpan = styled.span`
  animation: spin 3s linear infinite;
`;

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
  .loading-modal {
    width: 352px;
    height: 208px;
    background: #1d1b22;
    border-radius: 4px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    > button {
      font-size: 18px;
      position: absolute;
      top: 32px;
      right: 35px;
      height: auto;
      width: auto;
      background-color: transparent;
      margin: 0;
    }
    span:last-of-type {
      margin-bottom: 26px;
    }
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
      button {
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

const LoadingSpin = () => {
  return (
    <SpinSpan>
      <img src={Circle} alt="loading spinner" />
    </SpinSpan>
  );
};

const Header = ({ items, userStatus = defaultUser, wallet = defaultWallet }) => {
  const [authorized, setAuthorized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('metamask');
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const toggleModal = (e) => {
    e.preventDefault();
    setShowModal((prev) => !prev);
    setShowDetail(false);
  };
  const handleConnect = (e) => {
    e.preventDefault();
    if (e.target.id == 'start-connect') {
      return setLoading(true);
    }
    setAuthorized((prev) => !prev);
  };
  const handleSelectWallet = (e) => {
    e.preventDefault();
    setSelectedWallet(e.target.id);
  };

  useEffect(() => {
    let id;
    if (loading) {
      id = setTimeout(() => {
        setLoading(false);
        setShowDetail(true);
      }, 1000);
    }
    return () => {
      clearTimeout(id);
    };
  }, [loading, setLoading]);

  const { openModal, setDisplay } = useDispatch(({ modal: { openModal, setDisplay } }) => ({
    openModal,
    setDisplay,
  }));

  return (
    <StyledHeader>
      {showModal && (
        <div className="connect-a-wallet-modal">
          {loading ? (
            <div className="loading-modal">
              <button onClick={toggleModal}>
                <CloseOutlined />
              </button>
              <LoadingSpin />
              <br />
              <span>Please wait a moment</span>
            </div>
          ) : showDetail ? (
            <div className="connect-a-wallet-detail">
              <h4>
                <span>{mockWallets[selectedWallet].title}</span>
                <button id="close-detail" onClick={toggleModal}>
                  <CloseOutlined />
                </button>
              </h4>
              <h6>{mockWallets[selectedWallet].network}</h6>
              <Avatar className="user-avatar" src={userStatus.avatar} size={120} />
              <div className="wallet-balance">
                <span>Balance</span>
                <span>{`${mockWallets[selectedWallet].amount} ${mockWallets[selectedWallet].unit}`}</span>
                <span> = $98.22 USD</span>
              </div>
              <div className="wallet-address">
                <span>Wallet Address</span>
                <span>{hashShortener(mockWallets[selectedWallet].hash)}</span>
                <button>
                  <CopyOutlined /> Copy address
                </button>
              </div>
              <div className="nav-button">
                <button>Disconnect wallet</button>
                <button>Switch wallet</button>
              </div>
            </div>
          ) : (
            <div className="connect-a-wallet-card">
              <h4>
                <span className="card-title">Connect a wallet</span>
                <button onClick={toggleModal}>
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
