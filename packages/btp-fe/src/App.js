import { GlobalStyles } from 'components/Styles';
import { HelmetProvider } from 'react-helmet-async';

import Routes from './Routes';
import { ModalWrapper } from './components/NotificationModal';

import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Routes />
      <ModalWrapper />
      <GlobalStyles />
    </HelmetProvider>
  );
}

export default App;
