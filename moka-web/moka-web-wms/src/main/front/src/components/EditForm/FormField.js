import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import { MokaImageInput } from '@components';
import MokaCard from '../MokaCard';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { MokaInputLabel } from '../MokaInput';

const propTypes = {
    field: PropTypes.any,
};
/**
 * 기본 input
 */
const FormField = (props) => {
    const { field, id, name } = props;

    const [fieldValue, setFieldValue] = useState('');
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState('');
    const [type, setType] = useState('');
    const [formField, setFormField] = useState('');

    const handleTextChange = (event) => {
        setFieldValue(event.target.value);
        formField.value = fieldValue;
    };

    useEffect(() => {
        setFieldValue(field.value);
        setTitle(field.title);
        setOptions(field.options);
        setType(field.type);
        setFormField(field);
    }, [field]);

    switch (type) {
        case 'TEXT':
            return <MokaInputLabel as="input" key={id} label={title} value={fieldValue} name={id} id={id} onChange={handleTextChange}></MokaInputLabel>;
        case 'SELECT':
            return (
                <MokaInputLabel as="select" key={id} label={title}>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.text}
                        </option>
                    ))}
                </MokaInputLabel>
            );
        case 'CONTENT':
            return <MokaInputLabel as="textarea" key={id} label={title} value={fieldValue}></MokaInputLabel>;
        case 'IMAGE':
            return (
                <Form.Group className={clsx('d-flex', 'align-items-center')} key={id}>
                    <Form.Label className={clsx('px-0', 'mb-0', 'position-relative', 'text-right', 'mr-3')} style={{ width: 70, minWidth: 70 }} htmlFor="none">
                        {title}
                    </Form.Label>
                    <MokaImageInput as="textarea" key={id} label={title} xs={6}></MokaImageInput>
                </Form.Group>
            );

        case 'SEPARATOR':
            return <hr key={id} />;

        default:
            return <React.Fragment></React.Fragment>;
    }
};

FormField.prototype = propTypes;

export default FormField;
