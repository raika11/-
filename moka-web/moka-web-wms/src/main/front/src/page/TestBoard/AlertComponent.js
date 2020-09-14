import React from 'react';
import { Alert } from 'react-bootstrap';

const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

const DefaultAlert = () => (
    <div>
        {colors.map((variant, idx) => (
            <Alert key={idx} variant={variant}>
                This is a {variant} alert—check it out!
            </Alert>
        ))}
    </div>
);

const AlertComponet = () => (
    <>
        <DefaultAlert />
    </>
);

export default AlertComponet;
