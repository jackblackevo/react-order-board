import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { load, persistStateMiddleware } from './statePersistent';

const preloadedState = {
  order: {
    list: [
      {
        id: 'id-1',
        creationDate: 1579000000000,
        modificationDate: 1579000000000,
        name: 'test order 1',
        price: 999,
        note: 'something to note 1'
      },
      {
        id: 'id-2',
        creationDate: 1579000000000,
        modificationDate: 1579000000000,
        name: 'test order 2',
        price: 999,
        note: 'something to note 2'
      },
      {
        id: 'id-3',
        creationDate: 1579000000000,
        modificationDate: 1579000000000,
        name: 'test order 3',
        price: 999,
        note: 'something to note 3'
      }
    ]
  }
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: load(preloadedState),
  middleware: [...getDefaultMiddleware(), persistStateMiddleware]
});

export default store;
