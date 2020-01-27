import React, { FC, ReactNode } from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { text, number } from '@storybook/addon-knobs';
import { DecoratorFunction } from '@storybook/addons';
import OrderItem from '../OrderItem';

const defaultOrderData = {
  id: 'an-id',
  creationDate: 1579000000000,
  modificationDate: 1579000000000,
  name: 'test order',
  price: 999,
  note: 'something to note'
};

export const Default: FC = () => <OrderItem index={0} {...defaultOrderData} />;

export const asDynamicVariables: FC = () => {
  const name = text('name', 'typing your order name');
  const price = number('price', 1);
  const note = text('note', 'typing your note');

  return (
    <OrderItem
      index={0}
      {...defaultOrderData}
      name={name}
      price={price}
      note={note}
    />
  );
};

export default {
  title: 'OrderItem',
  component: OrderItem,
  decorators: [story => <Router>{story()}</Router>] as DecoratorFunction<
    ReactNode
  >[]
};
