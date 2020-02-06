import React from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import rootReducer from '../../../app/rootReducer';
import OrdersList from '../OrdersList';

describe('OrdersList component', () => {
  it('should render nothing when order list is empty', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: { orders: { list: [] } }
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <Router>
          <OrdersList />
        </Router>
      </Provider>
    );

    expect(getByTestId('container').childNodes.length).toBe(0);
  });

  it('should render an order item when order list has one item', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        orders: {
          list: [
            {
              id: 'an-id',
              creationDate: 1579000000000,
              modificationDate: 1579000000000,
              name: 'test order',
              price: 999,
              note: 'something to note'
            }
          ]
        }
      }
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <Router>
          <OrdersList />
        </Router>
      </Provider>
    );

    expect(getByTestId('container').childNodes.length).toBe(1);
  });
});
