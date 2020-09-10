import React from 'react';
import './assets/scss/classic.scss';

// router, history
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// redux
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';

import store from './store';
import Routes from './routes/Routes';

const browserHistory = createBrowserHistory();
function App() {
    return (
        <Provider store={store}>
            <Router history={browserHistory}>
                <Routes />
            </Router>
            <ReduxToastr
                timeOut={5000}
                newestOnTop={true}
                position="top-right"
                transitionIn="fadeIn"
                transitionOut="fadeOut"
                progressBar
                closeOnToastrClick
            />
        </Provider>
    );
}

export default App;
