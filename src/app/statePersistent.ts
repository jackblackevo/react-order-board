import { Middleware } from '@reduxjs/toolkit';
import debounce from '../utils/debounce';

const NAMESPACE = 'REDUX_LOCALSTORAGE';

export const load = (preloadedState?: object) => {
  const persistentState: object = JSON.parse(
    localStorage.getItem(NAMESPACE) || '{}'
  );

  if (Object.keys(persistentState).length === 0) return preloadedState;
  return persistentState;
};

const save = debounce((state: object) => {
  localStorage.setItem(NAMESPACE, JSON.stringify(state));
}, 250);

export const persistStateMiddleware: Middleware = ({
  getState
}) => next => action => {
  const dispatchedAction = next(action);
  const nextState = getState();

  save(nextState);

  return dispatchedAction;
};
