import React, { FC } from 'react';
import { action } from '@storybook/addon-actions';
import { PureOrderForm } from '../../OrderFormModal/OrderForm';

const orderFormData = {
  name: 'test order',
  price: 999,
  note: 'something to note',
  isDeletable: true
};

const actionsData = {
  onDelete: action('onDelete'),
  onCancel: action('onCancel'),
  onSubmit: action('onSubmit'),
  onUserInteractedChange: action('onUserInteractedChange')
};

export const NewOrder: FC = () => (
  <PureOrderForm
    name={''}
    price={0}
    note={''}
    isDeletable={false}
    {...actionsData}
  />
);

export const UpdateOrder: FC = () => (
  <PureOrderForm {...orderFormData} {...actionsData} />
);

export default {
  title: 'OrderFormModal/OrderForm',
  component: PureOrderForm
};
