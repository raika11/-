import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

// middleware
const sagaMiddleware = createSagaMiddleware();

let middleware;
if (process.env.NODE_ENV !== 'production') {
    middleware = composeWithDevTools(applyMiddleware(sagaMiddleware, createLogger()));
} else {
    middleware = applyMiddleware(sagaMiddleware);
}

// store create
export const store = createStore(rootReducer, middleware);
sagaMiddleware.run(rootSaga);

export default store;
