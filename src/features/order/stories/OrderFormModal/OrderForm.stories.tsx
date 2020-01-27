import React, { FC, ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { action } from '@storybook/addon-actions';
import { DecoratorFunction } from '@storybook/addons';
import rootReducer from '../../../../app/rootReducer';
import OrderForm from '../../OrderFormModal/OrderForm';

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

const actionsData = {
  onUserInteractedChange: action('onUserInteractedChange')
};

export const NewOrder: FC = () => (
  <Router initialEntries={['/new']}>
    <Route path="/new">
      <OrderForm {...actionsData} />
    </Route>
  </Router>
);

export const UpdateOrder: FC = () => (
  <Router initialEntries={['/order/an-id']}>
    <Route path="/order/:orderID">
      <OrderForm {...actionsData} />
    </Route>
  </Router>
);

export default {
  title: 'OrderFormModal/OrderForm',
  component: OrderForm,
  decorators: [
    story => <Provider store={store}>{story()}</Provider>
  ] as DecoratorFunction<ReactNode>[]
};
