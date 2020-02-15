import React, { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import NewOrderButton from '../features/ordersList/NewOrderButton';
import OrdersList from '../features/ordersList/OrdersList';
import OrderFormModal from '../features/orderForm/OrderFormModal';

const Wrapper = styled.div`
  max-width: 800px;
  width: 90%;
  margin: 15% auto 0;
`;

const App: FC = () => (
  <Wrapper>
    <NewOrderButton />
    <OrdersList />
    <Switch>
      <Route path={['/new', '/orders/:orderID']}>
        <OrderFormModal />
      </Route>
      <Redirect to="/" />
    </Switch>
  </Wrapper>
);

export default App;
