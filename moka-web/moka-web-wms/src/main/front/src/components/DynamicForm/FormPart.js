import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import { MokaImageInput } from '@components';
import MokaCard from '../MokaCard';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { MokaInputLabel } from '../MokaInput';
import FormField from './FormField';
import { useDispatch } from 'react-redux';
import t from '@/utils/toastUtil';
import { saveDynamicForm, changeDynamicForm } from '@store/dynamic';

const propTypes = {
    part: PropTypes.any,
    channelId: PropTypes.string,
};
/**
 * 기본 input
 */
const FormPart = (props) => {
    const { part, channelId } = props;
    const dispatch = useDispatch();

    const handleClickSave = (event) => {
        t.confirm('111', () => {
            insertDynamicFormPart(part);
        });
    };

    const insertDynamicFormPart = (tmp) => {
        dispatch(
            saveDynamicForm({
                type: 'insert',
                channelId: channelId,
                actions: [
                    changeDynamicForm({
                        ...part,
                        ...tmp,
                    }),
                ],
                callback: (response) => {
                    t.result(response);
                },
            }),
        );
    };

    return (
        <Card>
            <Card.Header>
                <Card.Title>{part.title}</Card.Title>
            </Card.Header>
            <Card.Body style={{ overflowY: 'scroll', height: 500 }}>
                {part.fieldGroups.map((fieldGroup) => (
                    <Form key={'F' + fieldGroup.group}>
                        {fieldGroup.fields.map((field, idx) => (
                            <FormField field={field} key={`${field.group}_${idx}`} id={`${field.group}_${idx}`} name={`${field.group}_${idx}`}></FormField>
                        ))}
                    </Form>
                ))}
            </Card.Body>
            <Card.Footer>
                <Button variant="primary" onClick={handleClickSave}>
                    저장
                </Button>
            </Card.Footer>
        </Card>
    );
};

FormPart.prototype = propTypes;

export default FormPart;
