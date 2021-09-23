import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import WebFont from 'webfontloader';

import App from './App';
/* When enable i18n again, remember to uncomment code in .babelrc.js */
// import 'i18n';
import reportWebVitals from './reportWebVitals';
import store, { history } from './store';

WebFont.load({
  google: {
    families: ['Poppins:300,500&display=swap'],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={''}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
