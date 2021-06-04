import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
// import { I18nextProvider } from 'react-i18next';
// import i18n from '../src/i18n';
import { GlobalStyles } from '../src/components/Styles'
import { configureActions } from '@storybook/addon-actions';
import 'antd/dist/antd.css';
import './style.css';

addDecorator((story) => (
  <React.Suspense fallback={''}>
    <MemoryRouter initialEntries={['/']}>
      {story()}
    </MemoryRouter>
    <GlobalStyles />
  </React.Suspense>
));

configureActions({
  depth: 100,
  // Limit the number of items logged into the actions panel
  limit: 10,
});

export const parameters = {
  actions: { argTypesRegex: "^(on|handle)[A-Z].*" },
}
