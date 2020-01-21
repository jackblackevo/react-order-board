import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import {
  MemoryRouter as Router,
  Route,
  RouteComponentProps
} from 'react-router-dom';
import rootReducer from '../../../app/rootReducer';
import NewOrderButton from '../NewOrderButton';

describe('NewOrderButton component', () => {
  it('should link to /new when click button', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: { order: { list: [] } }
    });

    let locationObj: RouteComponentProps['location'] | undefined;

    const { getByTestId } = render(
      <Provider store={store}>
        <Router>
          <NewOrderButton />
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

    userEvent.click(getByTestId('button'));

    expect(locationObj?.pathname).toBe('/new');
  });
});
