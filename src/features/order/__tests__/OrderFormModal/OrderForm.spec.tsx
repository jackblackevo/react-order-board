import React from 'react';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import {
  MemoryRouter as Router,
  Route,
  RouteComponentProps
} from 'react-router-dom';
import 'mutationobserver-shim';
import { v4 } from 'uuid';
import rootReducer from '../../../../app/rootReducer';
import OrderForm from '../../OrderFormModal/OrderForm';

jest.mock('uuid');

describe('OrderForm component', () => {
  it('should render empty form when url is /new', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        order: {
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
        <Router initialEntries={['/new']}>
          <Route path="/new">
            <OrderForm onUserInteractedChange={() => {}} />
          </Route>
        </Router>
      </Provider>
    );

    expect((getByTestId('name') as HTMLInputElement).value).toBe('');
    expect((getByTestId('price') as HTMLInputElement).value).toBe('');
    expect((getByTestId('note') as HTMLInputElement).value).toBe('');
  });

  it('should render form when url is /order/:orderID and can found an order from store', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        order: {
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
        <Router initialEntries={['/order/an-id']}>
          <Route path="/order/:orderID">
            <OrderForm onUserInteractedChange={() => {}} />
          </Route>
        </Router>
      </Provider>
    );

    expect((getByTestId('name') as HTMLInputElement).value).toBe('test order');
    expect((getByTestId('price') as HTMLInputElement).value).toBe('999');
    expect((getByTestId('note') as HTMLInputElement).value).toBe(
      'something to note'
    );
  });

  it('should redirect to / when url is orderID can not found an order from store', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        order: {
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

    let locationObj: RouteComponentProps['location'] | undefined;

    render(
      <Provider store={store}>
        <Router initialEntries={['/order/xxx-id']}>
          <Route path="/order/:orderID">
            <OrderForm onUserInteractedChange={() => {}} />
          </Route>
          <Route
            path="*"
            render={({ location }) => {
              locationObj = location;
              return null;
            }}
          />
        </Router>
      </Provider>
    );

    expect(locationObj?.pathname).toBe('/');
  });

  it('should link to / when cancel', async () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: { order: { list: [] } }
    });

    let locationObj: RouteComponentProps['location'] | undefined;

    const { getByTestId } = render(
      <Provider store={store}>
        <Router initialEntries={['/new']}>
          <Route path="/new">
            <OrderForm onUserInteractedChange={() => {}} />
          </Route>
          <Route
            path="*"
            render={({ location }) => {
              locationObj = location;
              return null;
            }}
          />
        </Router>
      </Provider>
    );

    expect(locationObj?.pathname).toBe('/new');

    await act(async () => {
      userEvent.click(getByTestId('cancel'));
    });

    expect(locationObj?.pathname).toBe('/');
  });

  it('should render form when url is /order/:orderID and can found an order from store', async () => {
    const handleUserInteractedChange = jest.fn();

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        order: {
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
        <Router initialEntries={['/order/an-id']}>
          <Route path="/order/:orderID">
            <OrderForm onUserInteractedChange={handleUserInteractedChange} />
          </Route>
        </Router>
      </Provider>
    );

    await act(async () => {
      await userEvent.type(getByTestId('name'), 'modify name');
    });

    expect(handleUserInteractedChange).toHaveBeenCalledTimes(2);
    expect(handleUserInteractedChange).toHaveBeenCalledWith(false);
    expect(handleUserInteractedChange).toHaveBeenLastCalledWith(true);
  });

  it('should add order when submit', async () => {
    const v4Mock = (v4 as jest.Mock<string>).mockImplementation(
      () => 'an-uuid'
    );
    const getTimeMock = jest
      .spyOn(Date.prototype, 'getTime')
      .mockImplementation(() => 1579000000000);

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: { order: { list: [] } }
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <Router initialEntries={['/new']}>
          <Route path="/new">
            <OrderForm onUserInteractedChange={() => {}} />
          </Route>
        </Router>
      </Provider>
    );

    await act(async () => {
      await userEvent.type(getByTestId('name'), 'order name');
      await userEvent.type(getByTestId('price'), '111');
    });

    expect(store.getState().order.list).toEqual([]);

    await act(async () => {
      userEvent.click(getByTestId('submit'));
    });

    expect(store.getState().order.list).toEqual([
      {
        id: 'an-uuid',
        creationDate: 1579000000000,
        modificationDate: 1579000000000,
        name: 'order name',
        price: 111,
        note: ''
      }
    ]);

    v4Mock.mockReset();
    getTimeMock.mockRestore();
  });

  it('should update order when submit', async () => {
    const getTimeMock = jest
      .spyOn(Date.prototype, 'getTime')
      .mockImplementation(() => 1579000000000);

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        order: {
          list: [
            {
              id: 'an-id',
              creationDate: 1578888888888,
              modificationDate: 1578888888888,
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
        <Router initialEntries={['/order/an-id']}>
          <Route path="/order/:orderID">
            <OrderForm onUserInteractedChange={() => {}} />
          </Route>
        </Router>
      </Provider>
    );

    expect((getByTestId('name') as HTMLInputElement).value).toBe('test order');
    expect((getByTestId('price') as HTMLInputElement).value).toBe('999');
    expect((getByTestId('note') as HTMLInputElement).value).toBe(
      'something to note'
    );

    await act(async () => {
      await userEvent.type(getByTestId('name'), 'modify name');
      await userEvent.type(getByTestId('price'), '111');
    });

    expect(store.getState().order.list).toEqual([
      {
        id: 'an-id',
        creationDate: 1578888888888,
        modificationDate: 1578888888888,
        name: 'test order',
        price: 999,
        note: 'something to note'
      }
    ]);

    await act(async () => {
      userEvent.click(getByTestId('submit'));
    });

    expect(store.getState().order.list).toEqual([
      {
        id: 'an-id',
        creationDate: 1578888888888,
        modificationDate: 1579000000000,
        name: 'modify name',
        price: 111,
        note: 'something to note'
      }
    ]);

    getTimeMock.mockRestore();
  });

  it('should delete order when delete', async () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        order: {
          list: [
            {
              id: 'an-id',
              creationDate: 1578888888888,
              modificationDate: 1578888888888,
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
        <Router initialEntries={['/order/an-id']}>
          <Route path="/order/:orderID">
            <OrderForm onUserInteractedChange={() => {}} />
          </Route>
        </Router>
      </Provider>
    );

    expect((getByTestId('name') as HTMLInputElement).value).toBe('test order');
    expect((getByTestId('price') as HTMLInputElement).value).toBe('999');
    expect((getByTestId('note') as HTMLInputElement).value).toBe(
      'something to note'
    );

    expect(store.getState().order.list).toEqual([
      {
        id: 'an-id',
        creationDate: 1578888888888,
        modificationDate: 1578888888888,
        name: 'test order',
        price: 999,
        note: 'something to note'
      }
    ]);

    await act(async () => {
      userEvent.click(getByTestId('delete'));
    });

    expect(store.getState().order.list).toEqual([]);
  });
});
