import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import { Moka, MokaImageInput, MokaInputLabel } from '@components';
import { Button, Col, Row } from 'react-bootstrap';

const propTypes = {
    field: PropTypes.any,
};
/**
 * 기본 input
 */
const PartField = (props) => {
    const { field, id, name } = props;

    const [fieldValue, setFieldValue] = useState('');
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState('');
    const [type, setType] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [formField, setFormField] = useState('');

    const handleChangeValue = (event) => {
        setFieldValue(event.target.value, () => {
            formField.value = fieldValue;
        });
    };

    useEffect(() => {
        setFieldValue(field.value);
        setTitle(field.title);
        setFieldName(field.name);
        setOptions(field.options);
        setType(field.type);
        setFormField(field);
    }, [field]);

    switch (type) {
        case 'TEXT':
            return (
                <Row>
                    <Col md={3}>
                        <Moka.Label label={title}></Moka.Label>
                    </Col>
                    <Col md={3}>
                        <Moka.Input name={`${fieldName}`} value={fieldName} onChange={handleChangeValue}></Moka.Input>
                    </Col>
                    <Col md={6}>
                        <Moka.Input name={fieldName} value={fieldValue} onChange={handleChangeValue}></Moka.Input>
                    </Col>
                </Row>
            );
        case 'SELECT':
            return (
                <Row>
                    <Col md={3}>
                        <Moka.Label label={title}></Moka.Label>
                    </Col>
                    <Col md={3}>
                        <Moka.Input name={`${fieldName}`} value={fieldName} onChange={handleChangeValue}></Moka.Input>
                    </Col>
                    <Col md={6}>
                        <Moka.Select name={fieldName} value={fieldValue} onChange={handleChangeValue}>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.text}
                                </option>
                            ))}
                        </Moka.Select>
                    </Col>
                </Row>
            );
        case 'CONTENT':
            return (
                <Row>
                    <Col md={3}>
                        <Moka.Label label={title}></Moka.Label>
                    </Col>
                    <Col md={3}>
                        <Moka.Input name={`${fieldName}`} value={fieldName} onChange={handleChangeValue}></Moka.Input>
                    </Col>
                    <Col md={6}>
                        <Moka.Input as="textarea" name={fieldName} value={fieldValue} onChange={handleChangeValue}></Moka.Input>
                    </Col>
                </Row>
            );
        case 'IMAGE':
            return (
                <Row>
                    <Col md={3}>
                        <Moka.Label>{title}</Moka.Label>
                    </Col>
                    <Col md={3}>
                        <Moka.Input name={`${fieldName}`} value={fieldName} onChange={handleChangeValue}></Moka.Input>
                    </Col>
                    <Col md={4}>
                        <Moka.Input name={fieldName} value={fieldValue} onChange={handleChangeValue}></Moka.Input>
                    </Col>
                    <Col md={2}>
                        <Button variant="primary">편집</Button>
                    </Col>
                </Row>
            );

        case 'SEPARATOR':
            return <hr key={id} />;

        default:
            return <React.Fragment></React.Fragment>;
    }
};

PartField.prototype = propTypes;

export default PartField;
