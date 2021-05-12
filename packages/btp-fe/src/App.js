import { GlobalStyles } from 'components/Styles';
import { HelmetProvider } from 'react-helmet-async';

import Routes from './Routes';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Routes />
      <GlobalStyles />
    </HelmetProvider>
  );
}

export default App;
