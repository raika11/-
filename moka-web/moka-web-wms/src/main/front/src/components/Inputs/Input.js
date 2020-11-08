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

export const Input = (props) => {
    const { id, className, name, disabled, onChange, ref, value, ...another } = props;
    return <InputFactory id={id} name={name} className={className} disabled={disabled} onChange={onChange} ref={ref} value={value} {...another} />;
};

Input.prototype = protoTypes;
Input.defaultProps = defaultProps;
