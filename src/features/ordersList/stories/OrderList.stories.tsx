import React, { FC, ReactNode } from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { object } from '@storybook/addon-knobs';
import { DecoratorFunction } from '@storybook/addons';
import { PureOrdersList } from '../OrdersList';

export const Default: FC = () => {
  const ordersList = object('ordersList', [
    {
      id: 'id-1',
      creationDate: 1579000000000,
      modificationDate: 1579000000000,
      name: 'test order 1',
      price: 999,
      note: 'something to note 1'
    },
    {
      id: 'id-2',
      creationDate: 1579000000000,
      modificationDate: 1579000000000,
      name: 'test order 2',
      price: 999,
      note: 'something to note 2'
    },
    {
      id: 'id-3',
      creationDate: 1579000000000,
      modificationDate: 1579000000000,
      name: 'test order 3',
      price: 999,
      note: 'something to note 3'
    }
  ]);

  return <PureOrdersList ordersList={ordersList} />;
};

export default {
  title: 'ordersList/OrdersList',
  component: PureOrdersList,
  decorators: [story => <Router>{story()}</Router>] as DecoratorFunction<
    ReactNode
  >[]
};
