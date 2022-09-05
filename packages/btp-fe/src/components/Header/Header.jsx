import { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { NavLink } from 'react-router-dom';

import Nav from './Nav';
import { WalletSelector } from './WalletSelector';
import { WalletDetails } from './WalletDetails';
import { Modal } from 'components/NotificationModal';
import { PrimaryButton, HamburgerButton } from 'components/Button';
import { Avatar } from 'components/Avatar';

import { useDispatch, useSelect } from 'hooks/useRematch';
import { requestAddress, isICONexInstalled, checkICONexInstalled } from 'connectors/ICONex/events';
import { resetTransferStep } from 'connectors/ICONex/utils';
import { wallets } from 'utils/constants';
import { toSeparatedNumberString, hashShortener, delay } from 'utils/app';
import { CONNECTED_WALLET_LOCAL_STORAGE } from 'connectors/constants';
import { EthereumInstance } from 'connectors/MetaMask';

import { SubTitle, Text } from 'components/Typography';
import { SubTitleMixin } from 'components/Typography/SubTitle';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import MetaMask from 'assets/images/metal-mask.svg';
import ICONex from 'assets/images/icon-ex.svg';
import Hana from 'assets/images/hana-wallet.png';
import NEAR from 'assets/images/near-icon.svg';
import logo from 'assets/images/logo-nexus-white.png';

const { darkBG, grayText, grayLine, primaryBrand, tertiaryBase } = colors;

const Wrapper = styled.div`
  .beta-text {
    font-size: 12px;
    text-align: center;
    width: 100%;
    background-color: ${primaryBrand};
    padding: 8px 0;

    a {
      font-weight: bold;
      color: inherit;
      text-decoration: underline;
    }

    ${media.md`
      font-size: 10px;
    `};
  }
`;

const StyledHeader = styled.header`
  height: 80px;
  width: 100%;
  padding: 0 40.5px;
  color: ${grayText};
  background-color: ${darkBG};
  border-bottom: 1px solid ${grayLine};

  display: flex;
  justify-content: space-between;
  align-items: center;

  .left-side {
    min-width: 175px;
  }

  .extension-link {
    color: ${tertiaryBase};
    font-size: 13px;
  }

  .right-side {
    ${SubTitleMixin.smBold};

    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

        .subtitle-text {
          white-space: nowrap;
        }

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

    ${media.md`
      width: 50%;
    `};
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
      border-radius: 0 0 20px 20px;

      min-height: calc(70vh - 80px);
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

const Logo = styled.img`
  width: 42px;
  height: 36px;
  object-fit: cover;
  object-position: 0 0;
`;

const BetaText = styled.div`
  margin-right: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .subtitle-text {
    font-weight: bold;
    margin-right: 3px;
  }
`;

const mockWallets = {
  [wallets.metamask]: {
    id: 'metamask',
    title: 'MetaMask Wallet',
    icon: MetaMask,
  },
  [wallets.iconex]: {
    id: 'iconex',
    title: 'ICON Wallet',
    icon: ICONex,
  },
  [wallets.hana]: {
    id: 'hana',
    title: 'ICON Wallet',
    icon: Hana,
  },
  [wallets.near]: {
    id: 'near',
    title: 'NEAR Wallet',
    icon: NEAR,
  },
};

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem(CONNECTED_WALLET_LOCAL_STORAGE) || wallets.metamask,
  );
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showConnector, setShowConnector] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [checkingICONexInstalled, setCheckingICONexInstalled] = useState(true);

  useEffect(() => {
    switch (localStorage.getItem(CONNECTED_WALLET_LOCAL_STORAGE)) {
      case wallets.metamask:
        EthereumInstance.getEthereumAccounts();
        break;
      // case wallets.near:
      //   getNearAccountInfo();
    }

    // wait after 2s for initial addICONexListener
    setTimeout(() => {
      checkICONexInstalled(() => {
        setCheckingICONexInstalled(false);
      });
    }, 2001);
  }, []);

  const {
    accountInfo: { address, balance, symbol, wallet, cancelConfirmation, currentNetwork, id },
  } = useSelect(({ account }) => ({
    accountInfo: account.selectAccountInfo,
  }));

  const { resetAccountInfo } = useDispatch(({ account: { resetAccountInfo } }) => ({
    resetAccountInfo,
  }));

  useEffect(() => {
    if (address) {
      setLoading(false);
      setShowConnector(false);
    }
  }, [address]);

  const shortedAddress = hashShortener(address);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
    setShowDetail(false);
    setShowConnector(true);
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetAccountInfo();

    switch (selectedWallet) {
      case wallets.iconex:
      case wallets.hana:
        const hasAccount = requestAddress();
        if (!hasAccount) {
          setLoading(false);
        }
        break;

      case wallets.metamask:
        if (!EthereumInstance.isMetaMaskInstalled()) return;
        const chainId = await EthereumInstance.connectMetaMaskWallet();
        if (chainId) {
          await delay(1500);
          await EthereumInstance.getEthereumAccounts(chainId);
        }
        setLoading(false);
        break;

      // case wallets.near:
      //   await connect();
      //   setLoading(false);
      //   break;
    }
    // must be set after all
    localStorage.setItem(CONNECTED_WALLET_LOCAL_STORAGE, selectedWallet);
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
    setShowModal(true);
    setShowConnector(true);
  };

  const onAvatarClicked = () => {
    setShowDetail(true);
    setShowModal(true);
  };

  const onConnectAWallet = () => {
    setLoading(false);
    setSelectedWallet(wallets.metamask);
    localStorage.removeItem(CONNECTED_WALLET_LOCAL_STORAGE);
    toggleModal();
  };

  return (
    <Wrapper>
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
              >
                {((selectedWallet == wallets.metamask && !EthereumInstance.isMetaMaskInstalled()) ||
                  ((selectedWallet == wallets.iconex || selectedWallet == wallets.hana) &&
                    !isICONexInstalled())) && (
                  <a
                    className="extension-link"
                    href={
                      selectedWallet == wallets.metamask
                        ? 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'
                        : 'https://chrome.google.com/webstore/detail/hana/jfdlamikmbghhapbgfoogdffldioobgl'
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    Or click here to install{' '}
                    {selectedWallet == wallets.metamask ? 'MetaMask' : 'Hana'} wallet
                  </a>
                )}
              </Modal>
            ) : (
              <>
                {showDetail && (
                  <Modal
                    display
                    setDisplay={setShowModal}
                    title={wallet && mockWallets[wallet].title}
                  >
                    <WalletDetails
                      networkName={currentNetwork}
                      symbol={symbol}
                      address={address}
                      shortedAddress={shortedAddress}
                      onDisconnectWallet={onDisconnectWallet}
                      onSwitchWallet={onSwitchWallet}
                      networkID={id}
                    />
                  </Modal>
                )}
                {showConnector && (
                  <Modal
                    title="Connect a wallet"
                    button={{ onClick: handleConnect, text: 'Next', id: 'do-connecting-wallet' }}
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
                    </div>
                  </Modal>
                )}
              </>
            )}
          </>
        )}
        <BetaText>
          <NavLink to="/">
            <Logo src={logo} alt="btp logo" />
            <SubTitle>NEXUS (BETA)</SubTitle>
          </NavLink>
        </BetaText>

        <HamburgerButton
          className={`menu-icon ${showMenu && 'active'}`}
          onClick={() => setShowMenu(!showMenu)}
        />
        <div className="right-side">
          <Nav setShowMenu={setShowMenu} />

          {address ? (
            <div className="account-info">
              <SubTitle className="sm">{currentNetwork}</SubTitle>
              <Avatar className="user-avatar" size={48} onClick={onAvatarClicked} />
              <span className="wallet-info">
                <Text className="xs address">{shortedAddress}</Text>
                <SubTitle className="md bold">
                  {toSeparatedNumberString(balance)} {symbol}
                </SubTitle>
              </span>
            </div>
          ) : (
            <PrimaryButton className="connect-to-wallet-btn" onClick={onConnectAWallet}>
              Connect a Wallet
            </PrimaryButton>
          )}
        </div>
      </StyledHeader>
      <SubTitle className="beta-text">
        Nexus is in beta while ICON Bridge is currently being audited. Please ensure you have read
        the{' '}
        <NavLink to={{ pathname: '/terms-of-use', state: { prevPath: location.pathname } }}>
          terms of use
        </NavLink>
        .
      </SubTitle>
    </Wrapper>
  );
};

export default Header;
