import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './rootReducer';
import rootEpic, { dependencies } from './rootEpic';
import { load, persistStateMiddleware } from './statePersistent';

const preloadedState = {
  orders: {
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

const epicMiddleware = createEpicMiddleware({ dependencies });

const store = configureStore({
  reducer: rootReducer,
  preloadedState: load(preloadedState),
  middleware: [
    ...getDefaultMiddleware(),
    epicMiddleware,
    persistStateMiddleware
  ]
});

epicMiddleware.run(rootEpic);

export default store;
