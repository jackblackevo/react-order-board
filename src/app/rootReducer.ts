import { combineReducers } from '@reduxjs/toolkit';
import { reducer as orderReducer } from '../features/order/orderSlice';

const rootReducer = combineReducers({ order: orderReducer });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
