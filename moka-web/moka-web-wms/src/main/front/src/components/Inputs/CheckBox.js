import React from 'react';
import InputFactory from '@components/InputFactory';
import PropTypes from 'prop-types';

const protoTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

const defaultProps = {
    disabled: false,
};
export const CheckBox = (props) => {
    return <InputFactory as="checkbox" {...props} />;
};

CheckBox.prototype = protoTypes;
CheckBox.defaultProps = defaultProps;
