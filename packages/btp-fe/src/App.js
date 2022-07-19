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
  console.log('--version: ', process.env.REACT_APP_VERSION);

  if (location.pathname !== E2ETestingRoute) {
    store.dispatch.modal.openModal({
      children: <BetaNotification setDisplay={store.dispatch.modal.setDisplay} />,
      button: {
        id: 'confirm-beta-button',
        text: 'Confirm',
        onClick: () => store.dispatch.modal.setDisplay(false),
      },
    });
  }

  return (
    <HelmetProvider>
      <Routes />
      <GlobalStyles />
    </HelmetProvider>
  );
}

export default App;
