import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  MemoryRouter as Router,
  Route,
  RouteComponentProps
} from 'react-router-dom';
import OrderItem from '../OrderItem';

describe('OrderItem component', () => {
  it('should render an order data', () => {
    const order = {
      id: 'an-id',
      creationDate: 1579000000000,
      modificationDate: 1579000000000,
      name: 'test order',
      price: 999,
      note: 'something to note'
    };

    const { getByTestId } = render(
      <Router>
        <OrderItem index={0} {...order} />
      </Router>
    );

    expect(getByTestId('no').textContent).toBe('1');
    expect(getByTestId('name').textContent).toBe('test order');
    expect(getByTestId('price').textContent).toBe('999');
    expect(getByTestId('note').textContent).toBe('something to note');
  });

  it('should link to /orders/:orderID when click row', () => {
    const order = {
      id: 'an-id',
      creationDate: 1579000000000,
      modificationDate: 1579000000000,
      name: 'test order',
      price: 999,
      note: 'something to note'
    };

    let locationObj: RouteComponentProps['location'] | undefined;

    const { getByTestId } = render(
      <Router>
        <OrderItem index={0} {...order} />
        <Route
          path="*"
          render={({ location }) => {
            locationObj = location;
            return null;
          }}
        />
      </Router>
    );

    expect(locationObj?.pathname).toBe('/');

    userEvent.click(getByTestId('row'));

    expect(locationObj?.pathname).toBe('/orders/an-id');
  });
});
