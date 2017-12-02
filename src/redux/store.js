import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import localForage from 'localforage';

import callLogReducer from './callLog/reducer';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
  const middlewares = [];

  return new Promise((resolve, reject) => {
    try {
      const store = createStore(
        combineReducers({
          callLog: callLogReducer,
        }),
        undefined,
        composeEnhancers(autoRehydrate(), applyMiddleware(...middlewares)),
      );

      persistStore(
        store,
        {
          storage: localForage,
          whitelist: ['callLog', 'dialer'],
        },
        () => resolve(store),
      );
    } catch (e) {
      reject(e);
    }
  });
}
