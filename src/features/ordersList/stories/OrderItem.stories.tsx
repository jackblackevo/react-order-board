import React, { FC } from 'react';
import { action } from '@storybook/addon-actions';
import { text, number } from '@storybook/addon-knobs';
import { PureOrderItem } from '../OrderItem';

const actionsData = {
  onClick: action('onClick')
};

export const Default: FC = () => {
  const id = text('id', 'an-id');
  const name = text('name', 'test order name');
  const price = number('price', 1);
  const note = text('note', 'test note');

  return (
    <PureOrderItem
      index={0}
      id={id}
      name={name}
      price={price}
      note={note}
      {...actionsData}
    />
  );
};

export default {
  title: 'ordersList/OrderItem',
  component: PureOrderItem
};
