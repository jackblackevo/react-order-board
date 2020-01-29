import React, { FC, ReactNode } from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { object } from '@storybook/addon-knobs';
import { DecoratorFunction } from '@storybook/addons';
import { PureOrderList } from '../OrderList';

export const Default: FC = () => {
  const orderList = object('orderList', [
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

  return <PureOrderList orderList={orderList} />;
};

export default {
  title: 'OrderList',
  component: PureOrderList,
  decorators: [story => <Router>{story()}</Router>] as DecoratorFunction<
    ReactNode
  >[]
};
