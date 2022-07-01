import { GlobalStyles } from 'components/Styles';
import { HelmetProvider } from 'react-helmet-async';
import store from 'store';

import Routes from './Routes';
import { addICONexListener } from './connectors/ICONex';
import { BetaNotification } from 'components/NotificationModal/BetaNotification';

require('connectors/chainConfigs');

addICONexListener();

function App() {
  console.log('--version: ', process.env.REACT_APP_VERSION);

  store.dispatch.modal.openModal({
    children: <BetaNotification />,
    button: {
      text: 'Confirm',
      onClick: () => store.dispatch.modal.setDisplay(false),
    },
  });

  return (
    <HelmetProvider>
      <Routes />
      <GlobalStyles />
    </HelmetProvider>
  );
}

export default App;
