import React from 'react';
import InputFactory from '@components/InputFactory';
import PropTypes from 'prop-types';

const protoTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
};

const defaultProps = {
    disabled: false,
};
export const Select = (props) => {
    const { id, className, name, disabled, onChange, ref, value, children, ...another } = props;
    return (
        <InputFactory as="select" id={id} name={name} className={className} disabled={disabled} onChange={onChange} ref={ref} value={value} {...another}>
            {children}
        </InputFactory>
    );
};

Select.prototype = protoTypes;
Select.defaultProps = defaultProps;
