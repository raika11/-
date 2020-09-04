import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { SSC } from '~/layouts/themes';
import WmsMessageBoxContainer from './WmsMessageBoxContainer';

const WithTheme = (props) => {
    const theme = useSelector((state) => state.authStore.theme) === 'SSC' ? SSC : null;

    return (
        <ThemeProvider theme={theme}>
            <WmsMessageBoxContainer {...props} />
        </ThemeProvider>
    );
};

export default WithTheme;
