import React from 'react';
import '~/assets/jss/components/WmsAgGridStyle.scss';

// router config
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// store config
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// middleware config
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

// store
import rootReducer, { rootSaga } from './stores';

// interceptors
import interceptors from './stores/api/interceptors';

// App
import App from './App';

// 미들웨어 설정
const sagaMiddleware = createSagaMiddleware();
let middleware;
if (process.env.NODE_ENV !== 'production') {
    middleware = composeWithDevTools(applyMiddleware(sagaMiddleware, createLogger()));
} else {
    middleware = applyMiddleware(sagaMiddleware);
}
export const store = createStore(rootReducer, middleware);
sagaMiddleware.run(rootSaga);

// 인터셉터 설정
interceptors.setupInterceptors(store);

// browserHistory
const browserHistory = createBrowserHistory();

const Root = () => {
    return (
        <Provider store={store}>
            <Router history={browserHistory}>
                <App />
            </Router>
        </Provider>
    );
};

export default Root;
