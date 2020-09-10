import React from 'react';

// router, history
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// redux, store
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import store from './store';

const browserHistory = createBrowserHistory();
function App() {
    return (
        <Provider store={store}>
            <Router history={browserHistory}>
                <div>
                    <h1>BackOffice</h1>
                </div>
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
