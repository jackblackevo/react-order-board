import React, { FC, ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import { DecoratorFunction } from '@storybook/addons';
import rootReducer from '../../../app/rootReducer';
import OrderList from '../OrderList';

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    order: {
      list: [
        {
          id: 'an-id',
          creationDate: 1579000000000,
          modificationDate: 1579000000000,
          name: 'test order',
          price: 999,
          note: 'something to note'
        }
      ]
    }
  }
});

export const Default: FC = () => <OrderList />;

export default {
  title: 'OrderList',
  component: OrderList,
  decorators: [
    story => (
      <Provider store={store}>
        <Router>{story()}</Router>
      </Provider>
    )
  ] as DecoratorFunction<ReactNode>[]
};
