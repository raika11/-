import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Moka } from '@components';
import { Button, Col, Row } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { changeField } from '@/store/editForm';

const propTypes = {
    field: PropTypes.any,
};
/**
 * 기본 input
 */
const Field = (props) => {
    const { id, name, partIdx, groupIdx, index, fieldIdx, onFieldChange } = props;

    const { editFormParts } = useSelector((store) => ({
        editFormParts: store.editForm.editFormParts,
    }));
    const part = editFormParts[partIdx];
    const fieldGroup = part.fieldGroups[groupIdx];
    const field = fieldGroup.fields[fieldIdx];

    const dispatch = useDispatch();

    const [fieldValue, setFieldValue] = useState('');
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState('');
    const [type, setType] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [currentField, setCurrentField] = useState(field);

    const handleChangeValue = async (event) => {
        const { value } = event.target;
        const updatedField = { ...field, value: value };
        setCurrentField(updatedField);
        //fieldGroup.fields.splice(fieldIdx, 0, updatedField);
        //editFormPartsContext[partIdx].fieldGroups[groupIdx].fields.splice(fieldIdx, 0, updatedField);
        // memberStore.setMember(updatedMember);
    };

    const handleChangeName = (event) => {
        const { value } = event.target;
        const updatedField = { ...field, name: value };
        setCurrentField(updatedField);
        //setFieldValue(event.target.value);
    };

    const handleBlur = () => {
        dispatch(changeField(partIdx, groupIdx, fieldIdx, currentField));
    };

    useEffect(() => {
        setFieldValue(field.value);
        setTitle(field.title);
        setFieldName(field.name);
        setOptions(field.options);
        setType(field.type);
        setCurrentField(field);
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
                        <Moka.Input name={`${fieldName}`} value={currentField?.name} onChange={handleChangeName} onBlur={handleBlur}></Moka.Input>
                    </Col>
                    <Col md={6}>
                        <Moka.Input name={fieldName} value={currentField?.value} onChange={handleChangeValue} onBlur={handleBlur}></Moka.Input>
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
                        <Moka.Input name={`${fieldName}`} value={currentField?.name} onChange={handleChangeName} onBlur={handleBlur}></Moka.Input>
                    </Col>
                    <Col md={6}>
                        <Moka.Select name={fieldName} value={currentField?.value} onChange={handleChangeValue} onBlur={handleBlur}>
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
                        <Moka.Input name={`${fieldName}`} value={currentField?.name} onChange={handleChangeName} onBlur={handleBlur}></Moka.Input>
                    </Col>
                    <Col md={6}>
                        <Moka.Input as="textarea" name={fieldName} value={currentField?.value} onChange={handleChangeValue} onBlur={handleBlur}></Moka.Input>
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
                        <Moka.Input name={`${fieldName}`} value={currentField?.name} onChange={handleChangeName} onBlur={handleBlur}></Moka.Input>
                    </Col>
                    <Col md={4}>
                        <Moka.Input name={fieldName} value={currentField?.value} onChange={handleChangeValue} onBlur={handleBlur}></Moka.Input>
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
