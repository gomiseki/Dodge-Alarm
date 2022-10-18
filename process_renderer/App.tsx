import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import GlobalStyle from './styles/global-style';
import theme from './styles/theme';
import configureStore from '../store/index';

import Main from './pages/main/index';
import Ready from './pages/ready/index';

function App() {
  const store = configureStore({ Renderer: window.api });
  return (
    <React.StrictMode>
      <GlobalStyle />
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {window.location.hash === '#main_window' ? <Main /> : <Ready />}
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
}
export default App;
