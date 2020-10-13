import React from 'react';

// BrowserRouter
import { BrowserRouter, Route } from 'react-router-dom';

// redux
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';

import store from './store';
import Routes from './routes/Routes';
import { getLocalItem } from './utils/storageUtil';
import SignIn from './pages/Auth/SignIn';

// https://www.npmjs.com/package/react-redux-toastr
const toastrOptions = {
    okText: '예',
    cancelText: '아니오',
    component: (props) => {
        console.log(props);
    },
};

function App() {
    const token = getLocalItem({ key: 'Authorization' });
    console.log(token);
    return (
        <Provider store={store}>
            {token ? (
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            ) : (
                <SignIn />
            )}

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
