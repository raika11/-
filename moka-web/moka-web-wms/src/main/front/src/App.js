import React from 'react';

// BrowserRouter
import { BrowserRouter } from 'react-router-dom';

// redux
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';

import store from './store';
import Routes from './routes/Routes';

// https://www.npmjs.com/package/react-redux-toastr
const toastrOptions = {
    okText: '예',
    cancelText: '아니오',
    component: (props) => {
        console.log(props);
    }
};

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
                options={toastrOptions}
            />
        </Provider>
    );
}

export default App;
