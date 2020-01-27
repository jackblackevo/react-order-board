import React, { FC, ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import { DecoratorFunction } from '@storybook/addons';
import rootReducer from '../../../app/rootReducer';
import NewOrderButton from '../NewOrderButton';

const store = configureStore({
  reducer: rootReducer,
  preloadedState: { order: { list: [] } }
});

export const Default: FC = () => <NewOrderButton />;

export default {
  title: 'NewOrderButton',
  component: NewOrderButton,
  decorators: [
    story => (
      <Provider store={store}>
        <Router>{story()}</Router>
      </Provider>
    )
  ] as DecoratorFunction<ReactNode>[]
};
