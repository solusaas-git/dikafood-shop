import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';

// Import reducers
import cartReducer from './reducers/cartReducer';

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  // Add other reducers here
});

// Setup Redux DevTools
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);

// Create store
const store = createStore(rootReducer, enhancer);

export default store;