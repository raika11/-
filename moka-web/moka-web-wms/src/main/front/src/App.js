import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// BrowserRouter
import { BrowserRouter } from 'react-router-dom';
import ReduxToastr from 'react-redux-toastr';

import Routes from './routes/Routes';
import SignIn from '@pages/Auth/SignIn';
import { init } from '@store/app';

// https://www.npmjs.com/package/react-redux-toastr
const toastrOptions = {
    okText: '예',
    cancelText: '아니오',
    component: (props) => {
        console.log(props);
    },
};

const WithToastr = ({ children }) => (
    <React.Fragment>
        {children}
        <ReduxToastr timeOut={5000} newestOnTop={true} position="top-right" transitionIn="fadeIn" transitionOut="fadeOut" progressBar closeOnToastrClick options={toastrOptions} />
    </React.Fragment>
);

const App = () => {
    const dispatch = useDispatch();

    const { AppLoading, AppError } = useSelector((store) => ({
        AppLoading: store.app.AppLoading,
        AppError: store.app.AppError,
    }));

    React.useEffect(() => {
        dispatch(init());
    }, [dispatch]);

    if (!AppLoading && !AppError) {
        return (
            <WithToastr>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </WithToastr>
        );
    } else if (AppError) {
        return (
            <WithToastr>
                <SignIn />
            </WithToastr>
        );
    }

    return null;
};

export default App;
