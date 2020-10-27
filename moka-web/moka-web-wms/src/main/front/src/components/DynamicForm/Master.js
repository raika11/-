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
    formData: PropTypes.any,
};
/**
 * 기본 input
 */
const DynamicForm = (props) => {
    const { formData } = props;
    const [formFields, setFormFields] = useState(null);
    const [testValue, setTestValue] = useState('test');

    const handleTestChange = (event) => {
        setTestValue(event.target.value);
    };

    const handleTextChange = (event, partId, field, fieldIdx) => {
        const values = formFields;
        values[`${field.group}_${fieldIdx}`] = event.target.value;
        setFormFields(values);
    };

    const renderField = (partId, field, fieldIdx) => {
        const fieldValue = formFields[`${field.group}_${fieldIdx}`];
        let fieldDom = <React.Fragment key={'FG' + field.group + fieldIdx}></React.Fragment>;
        switch (field.type) {
            case 'TEXT':
                fieldDom = (
                    <MokaInputLabel
                        as="input"
                        key={'FG' + fieldIdx}
                        label={field.title}
                        value={fieldValue}
                        name={field.title}
                        id={`INPUT_${field.group}_${fieldIdx}`}
                        onChange={(e) => handleTextChange(e, partId, field, fieldIdx)}
                    ></MokaInputLabel>
                );
                break;
            case 'SELECT':
                fieldDom = (
                    <MokaInputLabel as="select" key={'FG' + field.group + fieldIdx} label={field.title}>
                        {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </MokaInputLabel>
                );
                break;
            case 'CONTENT':
                fieldDom = <MokaInputLabel as="textarea" key={'FG' + field.group + fieldIdx} label={field.title}></MokaInputLabel>;
                break;
            case 'IMAGE':
                fieldDom = (
                    <Form.Group className={clsx('d-flex', 'align-items-center')} key={'FG' + field.group + fieldIdx}>
                        <Form.Label className={clsx('px-0', 'mb-0', 'position-relative', 'text-right', 'mr-3')} style={{ width: 70, minWidth: 70 }} htmlFor="none">
                            {field.title}
                        </Form.Label>
                        <MokaImageInput as="textarea" key={'FG' + fieldIdx} label={field.title} xs={6}></MokaImageInput>
                    </Form.Group>
                );
                break;
            case 'SEPARATOR':
                fieldDom = <hr key={'FG' + field.group + fieldIdx} />;
                break;
            default:
        }

        return fieldDom;
    };

    const renderFieldGroup = (part) => {
        return (
            <Card>
                <Card.Header>
                    <Card.Title>{part.title}</Card.Title>
                </Card.Header>
                <Card.Body style={{ overflowY: 'scroll', height: 500 }}>
                    {part.fieldGroups.map((fieldGroup) => (
                        <Form key={'F' + fieldGroup.group}>{fieldGroup.fields.map((field, idx) => renderField(part.id, field, idx))}</Form>
                    ))}
                </Card.Body>
                <Card.Footer>
                    <Button variant="primary">저장</Button>
                </Card.Footer>
            </Card>
        );
    };

    const renderFormData = useCallback((formFields) => {
        console.log('cc');
        if (!formFields) return;
        const formRows = [];
        if (formData != null && formData !== '') {
            let rows = formData.parts.length / 2;
            if (formData.parts.length !== rows * 2) {
                rows++;
            }
            let partIdx = 0;
            for (let idx = 0; idx < rows; idx++) {
                const resultRenderInfo = [];
                for (let colIdx = 0; colIdx < 2; colIdx++) {
                    if (partIdx < formData.parts.length) {
                        const part = formData.parts[partIdx];
                        if (part.active === 'Y') {
                            resultRenderInfo.push(
                                <Col lg={6} key={part.id}>
                                    {renderFieldGroup(part)}
                                </Col>,
                            );
                        }
                    }
                    partIdx++;
                }
                formRows.push(<Row key={formData.name + '_' + idx}>{resultRenderInfo}</Row>);
            }
        }

        return formRows;
    });

    useEffect(() => {
        if (formData) {
            const fieldValues = [];
            formData.parts.map((part) =>
                part.fieldGroups.map((fieldGroup) =>
                    fieldGroup.fields.forEach((field, fieldIdx) => {
                        fieldValues[`${field.group}_${fieldIdx}`] = field.value;
                    }),
                ),
            );
            setFormFields(fieldValues);
        }
    }, [formData]);

    useEffect(() => {
        if (formFields) {
            //    renderFormData(formFields);
        }
    }, [formFields, renderFormData]);

    return (
        <div>
            <MokaInputLabel as="input" key={'test'} label={'테스트'} value={testValue} onChange={(e) => handleTestChange(e)}></MokaInputLabel>
            {renderFormData(formFields)}
        </div>
    );
};

DynamicForm.prototype = propTypes;

export default DynamicForm;
