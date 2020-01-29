import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { of } from 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import {
  MemoryRouter as Router,
  Route,
  RouteComponentProps
} from 'react-router-dom';
import 'mutationobserver-shim';
import rootReducer from '../../../../app/rootReducer';
import rootEpic, { dependencies } from '../../../../app/rootEpic';
import OrderForm from '../../OrderFormModal/OrderForm';

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
    const postOrderApiMock = jest
      .spyOn(dependencies, 'postOrderAPI')
      .mockImplementation(order =>
        of({
          ...order,
          id: 'an-uuid',
          creationDate: 1579000000000,
          modificationDate: 1579000000000
        })
      );

    const epicMiddleware = createEpicMiddleware({ dependencies });
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: { order: { list: [] } },
      middleware: [epicMiddleware]
    });
    epicMiddleware.run(rootEpic);

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

    postOrderApiMock.mockRestore();
  });

  it('should update order when submit', async () => {
    const patchOrderApiMock = jest
      .spyOn(dependencies, 'patchOrderAPI')
      .mockImplementation(order =>
        of({
          ...order,
          creationDate: 1578888888888,
          modificationDate: 1579000000000
        })
      );

    const epicMiddleware = createEpicMiddleware({ dependencies });
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
      },
      middleware: [epicMiddleware]
    });
    epicMiddleware.run(rootEpic);

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

    patchOrderApiMock.mockRestore();
  });

  it('should delete order when delete', async () => {
    const deleteOrderApiMock = jest
      .spyOn(dependencies, 'deleteOrderAPI')
      .mockImplementation(_orderID => of(undefined));

    const epicMiddleware = createEpicMiddleware({ dependencies });
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
      },
      middleware: [epicMiddleware]
    });
    epicMiddleware.run(rootEpic);

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

    deleteOrderApiMock.mockRestore();
  });

  it('should prevent whitespace when input value start or end with whitespace', async () => {
    const postOrderApiMock = jest
      .spyOn(dependencies, 'postOrderAPI')
      .mockImplementation(order =>
        of({
          ...order,
          id: 'an-uuid',
          creationDate: 1579000000000,
          modificationDate: 1579000000000
        })
      );

    const epicMiddleware = createEpicMiddleware({ dependencies });
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: { order: { list: [] } },
      middleware: [epicMiddleware]
    });
    epicMiddleware.run(rootEpic);

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
      await userEvent.type(getByTestId('name'), ' order name ');
      fireEvent.blur(getByTestId('name'));

      await userEvent.type(getByTestId('price'), ' 111 ');
      fireEvent.blur(getByTestId('price'));

      await userEvent.type(getByTestId('note'), ' note something ');
      fireEvent.blur(getByTestId('note'));
    });

    expect((getByTestId('name') as HTMLInputElement).value).toBe('order name');
    expect((getByTestId('price') as HTMLInputElement).value).toBe('');
    expect((getByTestId('note') as HTMLInputElement).value).toBe(
      'note something'
    );

    expect(store.getState().order.list).toEqual([]);

    await act(async () => {
      userEvent.click(getByTestId('submit'));
    });

    expect(store.getState().order.list).toEqual([]);

    postOrderApiMock.mockRestore();
  });
});
