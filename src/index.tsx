import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import store from './app/store';
import App from './app/App';

const GlobalStyle = createGlobalStyle`
  ${reset}

  html {
    box-sizing: border-box;
    font-size: 62.5%;
    font-family: 'HelveticaNeue', Helvetica, Arial, 'Lucida Grande', sans-serif;

    background: #fbc856;
  }

  body {
    width: 100vw;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }
`;

render(
  <>
    <GlobalStyle />
    <Provider store={store}>
      <App />
    </Provider>
  </>,
  document.getElementById('root')
);
