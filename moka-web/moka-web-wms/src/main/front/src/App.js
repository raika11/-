import React from 'react';
import './assets/scss/classic.scss';

// BrowserRouter
import { BrowserRouter } from 'react-router-dom';

// redux
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';

import store from './store';
import Routes from './routes/Routes';

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
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
