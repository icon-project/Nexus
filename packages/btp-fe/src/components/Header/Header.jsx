import { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Avatar } from 'antd';

import Nav from './Nav';
import { WalletSelector } from './WalletSelector';
import { WalletDetails } from './WalletDetails';
import { Modal } from '../NotificationModal';
import { PrimaryButton, HamburgerButton } from '../Button';

import { useDispatch, useSelect } from 'hooks/useRematch';
import { requestAddress, isICONexInstalled, checkICONexInstalled } from 'connectors/ICONex/events';
import { resetTransferStep } from 'connectors/ICONex/utils';
import { wallets } from 'utils/constants';
import { toSeparatedNumberString, hashShortener } from 'utils/app';
import { CONNECTED_WALLET_LOCAL_STORAGE } from 'connectors/constants';
import { EthereumInstance } from 'connectors/MetaMask';

import { SubTitle, Text } from '../Typography';
import { SubTitleMixin } from 'components/Typography/SubTitle';
import { colors } from '../Styles/Colors';
import { media } from '../Styles/Media';

import defaultAvatar from 'assets/images/avatar.svg';
import MetaMask from 'assets/images/metal-mask.svg';
import ICONex from 'assets/images/icon-ex.svg';
import Hana from 'assets/images/hana-wallet.png';
// import logo from 'assets/images/logo-nexus-white.png';

const { darkBG, grayText, grayLine } = colors;

const StyledHeader = styled.header`
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
      padding: 0 20px;


      min-height: calc(100vh - 80px);
      width: 100%;
      background-color: ${grayLine};
      flex-direction: column-reverse;
      justify-content: flex-end;

      .connect-to-wallet-btn {
        margin-top: 100px;
      }
      .account-info {
        flex-direction: column;
        align-items: center;
        margin-top: 50px;

        .user-avatar, .wallet-info {
          margin: 5px 0;
          text-align: center;
        }
      }
    }
  `}
`;

// const Logo = styled.img`
//   width: 42.65px;
// `;

const mockWallets = {
  [wallets.metamask]: {
    id: 'metamask',
    title: 'MetaMask Wallet',
    icon: MetaMask,
  },
  [wallets.iconex]: {
    id: 'iconex',
    title: 'ICONex Wallet',
    icon: ICONex,
  },
  [wallets.hana]: {
    id: 'hana',
    title: 'Hana Wallet',
    icon: Hana,
  },
};

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem(CONNECTED_WALLET_LOCAL_STORAGE) || wallets.metamask,
  );
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [checkingICONexInstalled, setCheckingICONexInstalled] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(CONNECTED_WALLET_LOCAL_STORAGE) === wallets.metamask) {
      EthereumInstance.getEthereumAccounts();
    }
    // wait after 2s for initial addICONexListener
    setTimeout(() => {
      checkICONexInstalled(() => {
        setCheckingICONexInstalled(false);
      });
    }, 2001);
  }, []);

  const {
    accountInfo: { address, balance, unit, wallet, cancelConfirmation, currentNetwork },
  } = useSelect(({ account }) => ({
    accountInfo: account.selectAccountInfo,
  }));

  const { resetAccountInfo } = useDispatch(({ account: { resetAccountInfo } }) => ({
    resetAccountInfo,
  }));

  const shortedAddress = hashShortener(address);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
    setShowDetail(false);
  };
  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetAccountInfo();
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
    }
  };
  const handleSelectWallet = (wallet) => {
    if (wallet) setSelectedWallet(wallet);
  };

  const onDisconnectWallet = () => {
    resetTransferStep();
    resetAccountInfo();
    toggleModal();
  };

  const onSwitchWallet = () => {
    resetTransferStep();
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
                userAvatar={defaultAvatar}
                unit={unit}
                address={address}
                shortedAddress={shortedAddress}
                onDisconnectWallet={onDisconnectWallet}
                onSwitchWallet={onSwitchWallet}
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
      {/* <Logo src={logo} alt="btp logo" /> */}

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
              src={defaultAvatar}
              size={48}
              onClick={onAvatarClicked}
            />
            <span className="wallet-info">
              <Text className="xs address">{shortedAddress}</Text>
              <SubTitle className="md bold">
                {toSeparatedNumberString(balance)} {unit}
              </SubTitle>
            </span>
          </div>
        ) : (
          <PrimaryButton className="connect-to-wallet-btn" onClick={toggleModal}>
            Connect a Wallet
          </PrimaryButton>
        )}
      </div>
    </StyledHeader>
  );
};

export default Header;
