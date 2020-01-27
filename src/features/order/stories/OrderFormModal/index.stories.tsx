import React, { FC, ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { DecoratorFunction } from '@storybook/addons';
import rootReducer from '../../../../app/rootReducer';
import OrderFormModal from '../../OrderFormModal';

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

export const NewOrder: FC = () => (
  <Router initialEntries={['/new']}>
    <Route path="/new">
      <OrderFormModal />
    </Route>
  </Router>
);

export const UpdateOrder: FC = () => (
  <Router initialEntries={['/order/an-id']}>
    <Route path="/order/:orderID">
      <OrderFormModal />
    </Route>
  </Router>
);

export default {
  title: 'OrderFormModal',
  component: OrderFormModal,
  decorators: [
    story => <Provider store={store}>{story()}</Provider>
  ] as DecoratorFunction<ReactNode>[]
};
