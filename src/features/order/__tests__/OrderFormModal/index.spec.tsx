import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import rootReducer from '../../../../app/rootReducer';
import OrderForm from '../../OrderFormModal/OrderForm';
import OrderFormModal from '../../OrderFormModal';

jest.mock('../../OrderFormModal/OrderForm', () => jest.fn(() => null));

describe('OrderFormModal component', () => {
  it('should render modal when url is /new', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: { order: { list: [] } }
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <Router initialEntries={['/new']}>
          <Route path="/new">
            <OrderFormModal />
          </Route>
        </Router>
      </Provider>
    );

    expect(getByTestId('overlay')).toBeInTheDocument();
  });

  it('should close modal when click overlay', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: { order: { list: [] } }
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <Router initialEntries={['/new']}>
          <Route path="/new">
            <OrderFormModal />
          </Route>
        </Router>
      </Provider>
    );

    const modalOverlay = getByTestId('overlay');

    expect(modalOverlay).toBeInTheDocument();

    userEvent.click(modalOverlay);

    expect(modalOverlay).not.toBeInTheDocument();
  });

  it('should not close modal when user interacted form', () => {
    const OrderFormMock = (OrderForm as jest.Mock<
      ReturnType<typeof OrderForm>,
      Parameters<typeof OrderForm>
    >).mockImplementation(({ onUserInteractedChange }) => {
      useEffect(() => {
        onUserInteractedChange(true);
      }, [onUserInteractedChange]);

      return null;
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: { order: { list: [] } }
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <Router initialEntries={['/new']}>
          <Route path="/new">
            <OrderFormModal />
          </Route>
        </Router>
      </Provider>
    );

    const modalOverlay = getByTestId('overlay');

    expect(modalOverlay).toBeInTheDocument();

    userEvent.click(modalOverlay);

    expect(modalOverlay).toBeInTheDocument();

    OrderFormMock.mockReset();
  });
});
