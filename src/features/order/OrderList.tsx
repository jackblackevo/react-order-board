import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../app/rootReducer';
import OrderItem from './OrderItem';

const Container = styled.div`
  margin: 0 auto;
  width: 99%;
`;

const OrderList: FC = () => {
  const orderList = useSelector((state: RootState) => state.order.list);

  return (
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
};

export default OrderList;
