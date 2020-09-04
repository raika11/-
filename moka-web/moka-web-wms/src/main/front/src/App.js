import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack'; // API : https://iamhosseindhv.com/notistack/api
import { getLocalItem } from '~/utils/storageUtil';
import { SSC } from './layouts/themes';
import { WmsRoute, WmsLogin, WmsIconButton } from './components';

const App = () => {
    const Authorization = getLocalItem({ key: 'Authorization' });
    const theme = useSelector((state) => state.authStore.theme) === 'SSC' ? SSC : null;
    const notistackRef = React.createRef();
    const onCloseSnackbar = (key) => () => {
        notistackRef.current.closeSnackbar(key);
    };

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider
                ref={notistackRef}
                action={(key) => (
                    <WmsIconButton color="white" onClick={onCloseSnackbar(key)} icon="close" />
                )}
                maxSnack={3}
                domRoot={document.getElementById('react-notification')}
            >
                {!Authorization ? <WmsLogin /> : <WmsRoute />}
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
