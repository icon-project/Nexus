import { GlobalStyles } from 'components/Styles';
import { HelmetProvider } from 'react-helmet-async';

import Routes from './Routes';
import { addICONexListener } from './connectors/ICONex';

addICONexListener();

function App() {
  console.log('--version: ', process.env.REACT_APP_VERSION);
  return (
    <HelmetProvider>
      <Routes />
      <GlobalStyles />
    </HelmetProvider>
  );
}

export default App;
