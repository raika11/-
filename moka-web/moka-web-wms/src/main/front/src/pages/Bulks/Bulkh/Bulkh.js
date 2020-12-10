import React from 'react';
import PropTypes from 'prop-types';

const protoTypes = {
    bulksParams: PropTypes.object.isRequired,
};

const defaultProps = {
    bulksParams: {
        bulk_div: '',
        bulk_source: '',
    },
};

// { bulksParams }
const Bulkh = () => {
    return <>Bulkh</>;
};

export default Bulkh;

Bulkh.prototype = protoTypes;
Bulkh.defaultProps = defaultProps;
