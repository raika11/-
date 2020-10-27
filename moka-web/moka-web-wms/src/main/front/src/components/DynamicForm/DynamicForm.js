import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import { MokaImageInput } from '@components';
import MokaCard from '../MokaCard';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { MokaInputLabel } from '../MokaInput';
import FormPart from './FormPart';

const propTypes = {
    formData: PropTypes.any,
};
/**
 * 기본 input
 */
const DynamicForm = (props) => {
    const { formData } = props;
    const [dynamicForm, setDynamicForm] = useState(formData);

    const renderFormData = () => {
        const formRows = [];
        if (dynamicForm != null && dynamicForm !== '') {
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
                                    <FormPart part={part} channelId={dynamicForm.id} />
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
    };

    useEffect(() => {
        if (formData) {
            setDynamicForm(formData);
        }
    }, [formData, setDynamicForm]);

    return <div>{renderFormData()}</div>;
};

DynamicForm.prototype = propTypes;

export default DynamicForm;
