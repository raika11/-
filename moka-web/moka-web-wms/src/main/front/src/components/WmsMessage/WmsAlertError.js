import React from 'react';
import Alert from '@material-ui/lab/Alert';

/**
 * WMS Alert Error 용
 * @param {object|string|any} result Props
 */
const WmsAlertError = (result) => {
    let message = '';

    if (typeof result === 'string') {
        message = result;
    } else if (typeof result === 'object') {
        const { error } = result;
        if (error.header && !error.header.success) {
            message = error.header.message || '에러가 발생했습니다.';
        } else if (error.message) {
            message = error.message;
        } else {
            return null;
        }
    } else {
        return null;
    }

    return <Alert severity="error">{message}</Alert>;
};

export default WmsAlertError;
