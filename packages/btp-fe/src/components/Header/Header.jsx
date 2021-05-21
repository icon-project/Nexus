<<<<<<< HEAD
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout, Avatar } from 'antd';
=======
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Avatar } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
>>>>>>> 8630f5e (Feat/#21 connect to iconex wallet (#14))

import Nav from './Nav';
import { WalletSelector } from './WalletSelector';
import { WalletDetails } from './WalletDetails';
import { Modal } from '../NotificationModal';
<<<<<<< HEAD
import { PrimaryButton, HamburgerButton } from '../Button';

import { useDispatch, useSelect } from 'hooks/useRematch';
import { requestAddress, isICONexInstalled, checkICONexInstalled } from 'connectors/ICONex/events';
import { resetTransferStep } from 'connectors/ICONex/utils';
import { wallets } from 'utils/constants';
import { METAMASK_LOCAL_ADDRESS, CONNECTED_WALLET_LOCAL_STORAGE } from 'connectors/constants';
import { EthereumInstance } from 'connectors/MetaMask';

import { Header as Heading, SubTitle, Text } from '../Typography';
import { SubTitleMixin } from 'components/Typography/SubTitle';
import { colors } from '../Styles/Colors';
import { media } from '../Styles/Media';

import defaultAvatar from 'assets/images/avatar.svg';
import MetaMask from 'assets/images/metal-mask.svg';
import ICONex from 'assets/images/icon-ex.svg';
import Hana from 'assets/images/hana-wallet.png';

const { darkBG, grayText, grayLine, primaryBrandLight } = colors;
=======

import { useDispatch, useSelect } from '../../hooks/useRematch';
import { requestAddress } from '../../connectors/ICONex/events';
import { wallets } from '../../utils/constants';
import { currentICONexNetwork } from '../../connectors/constants';

import defaultAvatar from '../../assets/images/avatar.svg';
import MetaMask from '../../assets/images/metal-mask.svg';
import ICONex from '../../assets/images/icon-ex.svg';
import closeIcon from '../../assets/images/close-icon.svg';
import copyIcon from '../../assets/images/copy-icon.svg';
>>>>>>> 8630f5e (Feat/#21 connect to iconex wallet (#14))

const StyledHeader = styled(Layout.Header)`
  height: 80px;
  width: 100%;
  padding: 0 160px 0 40.5px;
  color: ${grayText};
  background-color: ${darkBG};
  border-bottom: 1px solid ${grayLine};

  display: flex;
  justify-content: space-between;
  align-items: center;

  .left-side {
    min-width: 175px;
  }

  .right-side {
    ${SubTitleMixin.smBold};

    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    min-width: 305px;

    .user-avatar {
      margin-left: 20px;
      cursor: pointer;
<<<<<<< HEAD
=======
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
>>>>>>> 8630f5e (Feat/#21 connect to iconex wallet (#14))
    }

    .account-info {
      display: flex;
      align-items: center;

      .wallet-info {
        margin-left: 8px;

        .address {
          margin-bottom: 4px;
        }
      }
    }
  }

  .connect-a-wallet-card {
    margin-top: 21px;
  }

  .connect-to-wallet-btn {
    ${SubTitleMixin.smBold};
    height: 44px;
    min-width: 170px;
    border-radius: 100px;
    text-align: center;
  }

  .menu-icon {
    display: none;
  }

  ${media.smallDesktop`
    padding: 0 40.5px;
  `};

  ${media.minWidthHeader`
    padding: 0 20px;
    position: relative;

    .menu-icon {
      display: block;
    }

    .right-side {
      display: ${({ $showMenu }) => ($showMenu ? 'flex' : 'none')};
      position: absolute;
      top: 80px;
      left: 0;
      z-index: 101;

      min-height: calc(100vh - 80px);
      width: 100%;
      background-color: ${grayLine};
      flex-direction: column-reverse;
      justify-content: flex-end;

      .connect-to-wallet-btn {
        margin-top: 100px;
      }
<<<<<<< HEAD
      .account-info {
        flex-direction: column;
        align-items: center;
        margin-top: 50px;

        .user-avatar, .wallet-info {
          margin: 5px 0;
          text-align: center;
=======
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
>>>>>>> 8630f5e (Feat/#21 connect to iconex wallet (#14))
        }
      }
    }
  `}
`;

const hashShortener = (hashStr) => {
  if (!hashStr) return '';
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
  hana: {
    id: 'hana',
    title: 'Hana Wallet',
    icon: Hana,
  },
};

<<<<<<< HEAD
=======
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

>>>>>>> 8630f5e (Feat/#21 connect to iconex wallet (#14))
const Header = ({ userStatus = defaultUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(wallets.metamask);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [checkingICONexInstalled, setCheckingICONexInstalled] = useState(true);

<<<<<<< HEAD
  useEffect(() => {
    if (localStorage.getItem(METAMASK_LOCAL_ADDRESS)) {
      EthereumInstance.getEthereumAccounts();
    }
  }, []);

  useEffect(() => {
    // wait after 2s for initial addICONexListener
    setTimeout(() => {
      checkICONexInstalled(() => {
        setCheckingICONexInstalled(false);
      });
    }, 2001);
  }, []);

  const {
    accountInfo: {
      address,
      balance,
      refundableBalance,
      unit,
      wallet,
      cancelConfirmation,
      currentNetwork,
    },
=======
  const {
    accountInfo: { address, balance, unit, wallet, cancelConfirmation },
>>>>>>> 8630f5e (Feat/#21 connect to iconex wallet (#14))
  } = useSelect(({ account }) => ({
    accountInfo: account.selectAccountInfo,
  }));

<<<<<<< HEAD
  const { resetAccountInfo } = useDispatch(({ account: { resetAccountInfo } }) => ({
    resetAccountInfo,
  }));

  const shortedAddress = hashShortener(address);
=======
  const { openModal, setDisplay, resetAccountInfo } = useDispatch(
    ({ modal: { openModal, setDisplay }, account: { resetAccountInfo } }) => ({
      openModal,
      setDisplay,
      resetAccountInfo,
    }),
  );
>>>>>>> 8630f5e (Feat/#21 connect to iconex wallet (#14))

  const toggleModal = () => {
    setShowModal((prev) => !prev);
    setShowDetail(false);
  };
  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetAccountInfo();
<<<<<<< HEAD
    localStorage.setItem(CONNECTED_WALLET_LOCAL_STORAGE, selectedWallet);
    if (selectedWallet === wallets.iconex || selectedWallet === wallets.hana) {
      const hasAccount = requestAddress();

      if (!hasAccount) {
        setLoading(false);
      }
    } else if (selectedWallet === wallets.metamask) {
      const isConnected = await EthereumInstance.connectMetaMaskWallet();
      if (isConnected) {
        await EthereumInstance.getEthereumAccounts();
      }
      setLoading(false);
=======
    if (e.target.id == 'start-connect') {
      if (selectedWallet === wallets.iconex) {
        const hasAccount = await requestAddress();

        if (!hasAccount) {
          setLoading(false);
        }
      }
>>>>>>> 8630f5e (Feat/#21 connect to iconex wallet (#14))
    }
  };
  const handleSelectWallet = (wallet) => {
    if (wallet) setSelectedWallet(wallet);
  };

  const onDisconnectWallet = () => {
<<<<<<< HEAD
    resetTransferStep();
=======
>>>>>>> 8630f5e (Feat/#21 connect to iconex wallet (#14))
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
    <StyledHeader $showMenu={showMenu}>
      {showModal && (
<<<<<<< HEAD
        <>
          {loading && !cancelConfirmation ? (
            <Modal
              icon="loader"
              desc="Please wait a moment."
              width="352px"
              display
              setDisplay={setShowModal}
            />
          ) : showDetail ? (
            <Modal display setDisplay={setShowModal} title={mockWallets[wallet].title}>
              <WalletDetails
                networkName={currentNetwork}
                userAvatar={userStatus.avatar}
                balance={balance}
                refundableBalance={refundableBalance}
                unit={unit}
                address={address}
                shortedAddress={shortedAddress}
                onDisconnectWallet={onDisconnectWallet}
                onSwitchWallet={onSwitchWallet}
=======
        <div className="connect-a-wallet-modal">
          {loading && !cancelConfirmation ? (
            <Modal icon="loader" desc="Please wait a moment." width="352px" display />
          ) : showDetail ? (
            <div className="connect-a-wallet-detail">
              <h4>
                <span>{mockWallets[wallet].title}</span>
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
>>>>>>> 8630f5e (Feat/#21 connect to iconex wallet (#14))
              />
            </Modal>
          ) : (
            <Modal
              title="Connect a wallet"
              button={{ onClick: handleConnect, text: 'Next' }}
              display
              setDisplay={setShowModal}
            >
              <div className="connect-a-wallet-card">
                <WalletSelector
                  type={wallets.metamask}
                  wallet={mockWallets}
                  active={selectedWallet == wallets.metamask}
                  onClick={() => handleSelectWallet(wallets.metamask)}
                  isInstalled={EthereumInstance.isMetaMaskInstalled()}
                />
                <WalletSelector
                  type={wallets.iconex}
                  wallet={mockWallets}
                  active={selectedWallet == wallets.iconex}
                  onClick={() => handleSelectWallet(wallets.iconex)}
                  isCheckingInstalled={checkingICONexInstalled}
                  isInstalled={isICONexInstalled()}
                />
                <WalletSelector
                  type={wallets.hana}
                  wallet={mockWallets}
                  active={selectedWallet == wallets.hana}
                  onClick={() => handleSelectWallet(wallets.hana)}
                  isCheckingInstalled={checkingICONexInstalled}
                  isInstalled={isICONexInstalled()}
                />
              </div>
            </Modal>
          )}
        </>
      )}
      <div className="left-side">
        <Heading className="xs bold" color={primaryBrandLight}>
          BTP Dashboard
        </Heading>
      </div>
      <HamburgerButton
        className={`menu-icon ${showMenu && 'active'}`}
        onClick={() => setShowMenu(!showMenu)}
      />
      <div className="right-side">
        <Nav setShowMenu={setShowMenu} />
        {address ? (
          <div className="account-info">
            <SubTitle className="sm">{currentNetwork}</SubTitle>
            <Avatar
              className="user-avatar"
              src={userStatus.avatar}
              size={48}
              onClick={onAvatarClicked}
            />
            <span className="wallet-info">
              <Text className="sm address">{shortedAddress}</Text>
              <SubTitle className="md bold">
                {balance} {unit}
              </SubTitle>
            </span>
          </div>
        ) : (
          <PrimaryButton className="connect-to-wallet-btn" onClick={toggleModal}>
            Connect a Wallet
          </PrimaryButton>
        )}
      </div>
<<<<<<< HEAD
=======
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
>>>>>>> 8630f5e (Feat/#21 connect to iconex wallet (#14))
    </StyledHeader>
  );
};

export default Header;
