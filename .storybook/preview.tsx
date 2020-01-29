import React from 'react';
import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}

  html {
    box-sizing: border-box;
    font-size: 62.5%;
    font-family: 'HelveticaNeue', Helvetica, Arial, 'Lucida Grande', sans-serif;
  }

  body {
    width: 100vw;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }
`;

addDecorator(story => (
  <>
    <GlobalStyle />
    {story()}
  </>
));

addDecorator(withKnobs)
