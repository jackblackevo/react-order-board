import React, { FC } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { PureNewOrderButton } from '../NewOrderButton';

const actionsData = {
  onClick: action('onClick')
};

export const Default: FC = () => {
  const isGlowingVisible = boolean('isGlowingVisible', true);

  return (
    <PureNewOrderButton isGlowingVisible={isGlowingVisible} {...actionsData} />
  );
};

export default {
  title: 'NewOrderButton',
  component: PureNewOrderButton
};
