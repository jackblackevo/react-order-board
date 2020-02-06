import React, { FC, ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { DecoratorFunction } from '@storybook/addons';
import rootReducer from '../../../app/rootReducer';
import { PureOrderFormModal } from '../OrderFormModal';

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    orders: {
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
  onOverlayClick: action('onOverlayClick'),
  onUserInteractedChange: action('onUserInteractedChange')
};

export const NewOrder: FC = () => {
  const isUnSafeExit = boolean('isUnSafeExit', false);

  return (
    <Router initialEntries={['/new']}>
      <Route path="/new">
        <PureOrderFormModal isUnSafeExit={isUnSafeExit} {...actionsData} />
      </Route>
    </Router>
  );
};

export const UpdateOrder: FC = () => {
  const isUnSafeExit = boolean('isUnSafeExit', false);

  return (
    <Router initialEntries={['/orders/an-id']}>
      <Route path="/orders/:orderID">
        <PureOrderFormModal isUnSafeExit={isUnSafeExit} {...actionsData} />
      </Route>
    </Router>
  );
};

export default {
  title: 'orderForm/OrderFormModal',
  component: PureOrderFormModal,
  decorators: [
    story => <Provider store={store}>{story()}</Provider>
  ] as DecoratorFunction<ReactNode>[]
};
