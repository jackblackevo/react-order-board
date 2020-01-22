import React, { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import NewOrderButton from '../features/order/NewOrderButton';
import OrderList from '../features/order/OrderList';
import OrderFormModal from '../features/order/OrderFormModal';

const Wrapper = styled.div`
  max-width: 800px;
  width: 90%;
  margin: 15% auto 0;
`;

const App: FC = () => (
  <Wrapper>
    <NewOrderButton />
    <OrderList />
    <Switch>
      <Route path={['/new', '/order/:orderID']}>
        <OrderFormModal />
      </Route>
      <Redirect to="/" />
    </Switch>
  </Wrapper>
);

export default App;
