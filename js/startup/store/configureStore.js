
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import { applyMiddleware, createStore, compose } from 'redux';

import thunk from 'redux-thunk';


import promise from './promise';
import array from './array';
import analytics from './analytics';
import reducers from '../reducers';

const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;


function configureStore(onComplete: ?() => void) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(
    applyMiddleware(thunk, promise, array, analytics),
    autoRehydrate()
  );
    // TODO(frantic): reconsider usage of redux-persist, maybe add cache breaker
  const store = createStore(reducers, enhancer);
  persistStore(store, { storage: AsyncStorage }, onComplete);
  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

export default configureStore;
