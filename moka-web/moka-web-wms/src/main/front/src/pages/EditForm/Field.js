import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Moka } from '@components';
import { Button, Col, Row } from 'react-bootstrap';

import { useDispatch } from 'react-redux';
import { changeFieldGroup } from '@/store/editForm';
import { EditFormPartsContext } from './EditFormEdit';

const propTypes = {
    field: PropTypes.any,
};
/**
 * 기본 input
 */
const Field = (props) => {
    const { id, name, partIdx, groupIdx, index, fieldIdx, onFieldChange } = props;

    const editFormPartsContext = useContext(EditFormPartsContext);
    const part = editFormPartsContext[partIdx];
    const fieldGroup = part.fieldGroups[groupIdx];
    const field = fieldGroup.fields[fieldIdx];

    const dispatch = useDispatch();

    const [fieldValue, setFieldValue] = useState('');
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState('');
    const [type, setType] = useState('');
    const [fieldName, setFieldName] = useState('');

    const handleChangeValue = async (event) => {
        const { name, value } = event.target;
        const updatedField = { ...field, value: value };
        console.log(updatedField);
        fieldGroup.fields.splice(fieldIdx, 0, updatedField);
        editFormPartsContext[partIdx].fieldGroups[groupIdx].fields.splice(fieldIdx, 0, updatedField);
        // memberStore.setMember(updatedMember);
    };

    const handleChangeName = (event) => {
        setFieldValue(event.target.value);
    };

    const handleBlur = () => {
        dispatch(changeFieldGroup(fieldGroup, index, { ...field, name: fieldName, value: fieldValue }));
        console.log(fieldGroup);
        //onFieldChange(index, { ...field, name: fieldName, value: fieldValue });
    };

    useEffect(() => {
        setFieldValue(field.value);
        setTitle(field.title);
        setFieldName(field.name);
        setOptions(field.options);
        setType(field.type);
    }, [field]);

    switch (type) {
        case 'TEXT':
        case 'LINK':
            return (
                <Row>
                    <Col md={3}>
                        <Moka.Label label={title}></Moka.Label>
                    </Col>
                    <Col md={3}>
                        <Moka.Input name={`${fieldName}`} value={field?.name} onChange={handleChangeName} onBlur={handleBlur}></Moka.Input>
                    </Col>
                    <Col md={6}>
                        <Moka.Input name={fieldName} value={field?.value} onChange={handleChangeValue} onBlur={handleBlur}></Moka.Input>
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
                        <Moka.Input name={`${fieldName}`} value={field?.name} onChange={handleChangeName} onBlur={handleBlur}></Moka.Input>
                    </Col>
                    <Col md={6}>
                        <Moka.Select name={fieldName} value={field?.value} onChange={handleChangeValue} onBlur={handleBlur}>
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
                        <Moka.Input name={`${fieldName}`} value={field?.name} onChange={handleChangeName} onBlur={handleBlur}></Moka.Input>
                    </Col>
                    <Col md={6}>
                        <Moka.Input as="textarea" name={fieldName} value={fieldValue} onChange={handleChangeValue} onBlur={handleBlur}></Moka.Input>
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
                        <Moka.Input name={`${fieldName}`} value={fieldName} onChange={handleChangeName} onBlur={handleBlur}></Moka.Input>
                    </Col>
                    <Col md={4}>
                        <Moka.Input name={fieldName} value={fieldValue} onChange={handleChangeValue} onBlur={handleBlur}></Moka.Input>
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

Field.prototype = propTypes;

export default Field;
