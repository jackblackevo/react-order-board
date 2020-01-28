import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../app/rootReducer';
import OrderItem from './OrderItem';

const Container = styled.div`
  margin: 0 auto;
  width: 99%;
`;

interface Props {
  orderList: {
    id: string;
    name: string;
    price: number;
    note: string;
  }[];
}

export const PureOrderList: FC<Props> = ({ orderList }) => (
  <Container data-testid="container">
    {orderList.map(({ id, name, price, note }, index) => (
      <OrderItem
        key={id}
        index={index}
        id={id}
        name={name}
        price={price}
        note={note}
      />
    ))}
  </Container>
);

export default () => {
  const orderList = useSelector((state: RootState) => state.order.list);

  return <PureOrderList orderList={orderList} />;
};
