import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { RootState } from '../../app/rootReducer';

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

const orderSlice = createSlice({
  name: 'order',
  initialState: { list: [] } as Order,
  reducers: {
    addOrder: (
      state,
      { payload }: PayloadAction<Pick<OrderItem, 'name' | 'price' | 'note'>>
    ) => {
      const { list } = state;
      const orderItem = {
        ...payload,
        id: v4(),
        creationDate: new Date().getTime(),
        modificationDate: new Date().getTime()
      };

      return { ...state, list: [...list, orderItem] };
    },

    deleteOrder: (state, { payload }: PayloadAction<OrderItem['id']>) => {
      const { list } = state;

      return { ...state, list: list.filter(({ id }) => id !== payload) };
    },

    updateOrder: (
      state,
      {
        payload
      }: PayloadAction<Pick<OrderItem, 'id' | 'name' | 'price' | 'note'>>
    ) => {
      const { list } = state;
      const orderIdx = list.findIndex(({ id }) => payload.id === id);
      const orderItem = {
        ...list[orderIdx],
        ...payload,
        modificationDate: new Date().getTime()
      };

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
export const { addOrder, deleteOrder, updateOrder } = orderSlice.actions;

export const makeOrderByIDSelector = () =>
  createSelector(
    [
      (state: RootState) => state.order.list,
      (_state: RootState, id: string) => id
    ],
    (orderList, id) => orderList.find(order => order.id === id)
  );
