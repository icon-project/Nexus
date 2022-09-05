import { useEffect } from 'react';
import { GlobalStyles } from 'components/Styles';
import { HelmetProvider } from 'react-helmet-async';
import store from 'store';

import Routes from './Routes';
import { addICONexListener } from './connectors/ICONex';
import { BetaNotification } from 'components/NotificationModal/BetaNotification';
import { E2ETestingRoute } from 'utils/constants';

require('connectors/chainConfigs');

addICONexListener();

function App() {
  useEffect(() => {
    console.log('--version: ', process.env.REACT_APP_VERSION);
    const IN_SESSION = 'IN_SESSION';
    const isInSession = sessionStorage.getItem(IN_SESSION);

    if (location.pathname !== E2ETestingRoute && !isInSession) {
      store.dispatch.modal.openModal({
        children: <BetaNotification setDisplay={store.dispatch.modal.setDisplay} />,
        button: {
          id: 'confirm-beta-button',
          text: 'Confirm',
          onClick: () => store.dispatch.modal.setDisplay(false),
        },
      });

      sessionStorage.setItem(IN_SESSION, true);
    }
  }, []);

  return (
    <HelmetProvider>
      <Routes />
      <GlobalStyles />
    </HelmetProvider>
  );
}

export default App;
