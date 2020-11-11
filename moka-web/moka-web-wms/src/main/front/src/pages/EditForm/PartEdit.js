import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import { Button, Card } from 'react-bootstrap';
import PartField from './PartField';
import { useDispatch } from 'react-redux';
import toast from '@/utils/toastUtil';
import { changeEditForm, saveEditForm } from '@/store/editForm';

const propTypes = {
    part: PropTypes.any,
    formId: PropTypes.string,
};
/**
 * 기본 input
 */
const PartEdit = (props) => {
    const { part, formId } = props;
    const dispatch = useDispatch();

    const handleClickSave = (event) => {
        insertEditFormPart({ partJson: JSON.stringify(part) });
    };

    const insertEditFormPart = (tmp) => {
        dispatch(
            saveEditForm({
                type: 'insert',
                formId: formId,
                partId: part.id,
                actions: [
                    changeEditForm({
                        ...{ partJson: JSON.stringify(part) },
                        ...tmp,
                    }),
                ],
                callback: (response) => {
                    toast.result(response);
                },
            }),
        );
    };

    return (
        <Card>
            <Card.Header>
                <Card.Title>{part.title}</Card.Title>
            </Card.Header>

            <Card.Body>
                {part.fieldGroups.map((fieldGroup) => (
                    <Form key={'F' + fieldGroup.group}>
                        {fieldGroup.fields.map((field, idx) => (
                            <PartField field={field} key={`${field.group}_${idx}`} id={`${field.group}_${idx}`} name={`${field.group}_${idx}`}></PartField>
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

PartEdit.prototype = propTypes;

export default PartEdit;
