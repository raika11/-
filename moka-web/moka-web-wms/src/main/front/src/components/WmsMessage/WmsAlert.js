import React from 'react';
import Alert from '@material-ui/lab/Alert';

/**
 * Wms Alert
 * @param {object} props Props
 * @param {string} props.severity severity
 * @param {string} props.message message
 */
const WmsAlert = (props) => {
    const { severity, message, overrideClassName, ...rest } = props;

    return (
        <Alert {...rest} severity={severity || 'success'} className={overrideClassName}>
            {message}
        </Alert>
    );
};

export default WmsAlert;
