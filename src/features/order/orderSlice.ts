import {
  createSlice,
  createSelector,
  createAction,
  PayloadAction
} from '@reduxjs/toolkit';
import { Epic } from 'redux-observable';
import { of } from 'rxjs';
import { filter, mergeMap, map, catchError } from 'rxjs/operators';
import { RootState } from '../../app/rootReducer';
import { Dependencies } from '../../app/rootEpic';

interface OrderItem {
  id: string;
  creationDate: number;
  modificationDate: number;
  name: string;
  price: number;
  note: string;
}

interface Order {
  list: OrderItem[];
}

export const addOrder = createAction<
  Pick<OrderItem, 'name' | 'price' | 'note'>
>('order/addOrder');

export const deleteOrder = createAction<OrderItem['id']>('order/deleteOrder');

export const updateOrder = createAction<
  Omit<OrderItem, 'creationDate' | 'modificationDate'>
>('order/updateOrder');

export const apiError = createAction<Error>('order/apiError');

const orderSlice = createSlice({
  name: 'order',
  initialState: { list: [] } as Order,
  reducers: {
    addOrderFulfilled: (
      state,
      { payload: orderItem }: PayloadAction<OrderItem>
    ) => {
      const { list } = state;

      return { ...state, list: [...list, orderItem] };
    },

    deleteOrderFulfilled: (
      state,
      { payload }: PayloadAction<OrderItem['id']>
    ) => {
      const { list } = state;

      return { ...state, list: list.filter(({ id }) => id !== payload) };
    },

    updateOrderFulfilled: (
      state,
      { payload: orderItem }: PayloadAction<OrderItem>
    ) => {
      const { list } = state;
      const orderIdx = list.findIndex(({ id }) => orderItem.id === id);

      return {
        ...state,
        list: [
          ...list.slice(0, orderIdx),
          orderItem,
          ...list.slice(orderIdx + 1)
        ]
      };
    }
  }
});

export const { reducer } = orderSlice;
export const {
  addOrderFulfilled,
  deleteOrderFulfilled,
  updateOrderFulfilled
} = orderSlice.actions;

export const addOrderEpic: Epic<
  ReturnType<typeof addOrder>,
  ReturnType<typeof addOrderFulfilled>,
  RootState,
  Dependencies
> = (action$, _state$, { postOrderAPI }) =>
  action$.pipe(
    filter(addOrder.match),
    mergeMap(action =>
      postOrderAPI(action.payload).pipe(
        map(addOrderFulfilled),
        catchError(error => of(apiError(error)))
      )
    )
  );

export const deleteOrderEpic: Epic<
  ReturnType<typeof deleteOrder>,
  ReturnType<typeof deleteOrderFulfilled>,
  RootState,
  Dependencies
> = (action$, _state$, { deleteOrderAPI }) =>
  action$.pipe(
    filter(deleteOrder.match),
    mergeMap(action =>
      deleteOrderAPI(action.payload).pipe(
        map(() => deleteOrderFulfilled(action.payload)),
        catchError(error => of(apiError(error)))
      )
    )
  );

export const updateOrderEpic: Epic<
  ReturnType<typeof updateOrder>,
  ReturnType<typeof updateOrderFulfilled>,
  RootState,
  Dependencies
> = (action$, _state$, { patchOrderAPI }) =>
  action$.pipe(
    filter(updateOrder.match),
    mergeMap(action =>
      patchOrderAPI(action.payload).pipe(
        map(updateOrderFulfilled),
        catchError(error => of(apiError(error)))
      )
    )
  );

export const makeOrderByIDSelector = () =>
  createSelector(
    [
      (state: RootState) => state.order.list,
      (_state: RootState, id: string) => id
    ],
    (orderList, id) => orderList.find(order => order.id === id)
  );
