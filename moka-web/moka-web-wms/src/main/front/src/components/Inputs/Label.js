import React from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import { Col } from 'react-bootstrap';

export const Label = (props) => {
    // label props
    const { label, labelWidth, className, labelClassName, required, children } = props;

    return (
        <Form.Group className={clsx('d-flex', 'align-items-center', className)}>
            <Form.Label
                className={clsx('px-0', 'mb-0', 'position-relative', 'text-left', labelClassName)}
                style={{ width: labelWidth, minWidth: labelWidth, marginRight: 12 }}
                htmlFor="none"
            >
                {required && <span className="required-text">*</span>}
                {label}
            </Form.Label>
            {children}
        </Form.Group>
    );
};
