import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const SpinnerComponent = (props) => {
    const { animation, size, variant, ...rest } = props;

    return (
        <Spinner animation={animation} size={size} variant={variant} role="status" {...rest}>
            <span className="sr-only">Loading...</span>
        </Spinner>
    );
};

export default SpinnerComponent;
