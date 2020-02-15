import { combineReducers } from '@reduxjs/toolkit';
import { reducer as orderReducer } from '../features/ordersList/ordersSlice';

const rootReducer = combineReducers({ orders: orderReducer });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
