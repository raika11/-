import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FieldGroup from './FieldGroup';
import { saveEditFormPart } from '@/store/editForm';
import toast from '@/utils/toastUtil';

const propTypes = {
    part: PropTypes.any,
    formId: PropTypes.string,
};
/**
 * 기본 input
 */
const PartEdit = (props) => {
    const { partIdx, formId } = props;
    const dispatch = useDispatch();

    const { editFormParts } = useSelector((store) => ({
        editFormParts: store.editForm.editFormParts,
    }));

    const part = editFormParts[partIdx];

    const handleClickSave = (event) => {
        insertEditFormPart({ partJson: JSON.stringify(part) });
    };

    const insertEditFormPart = (tmp) => {
        console.log(part);
        dispatch(
            saveEditFormPart({
                type: 'update',
                formSeq: part.formSeq,
                partSeq: part.partSeq,
                partJson: {
                    partId: part.partId,
                    partTitle: part.partTitle,
                    usedYn: part.useYn,
                    status: 'SAVE',
                    formData: JSON.stringify(part.fieldGroups),
                },
                callback: (response) => {
                    toast.result(response);
                },
            }),
        );
    };

    return (
        <Card className="mb-2">
            <Card.Header>
                <Card.Title>{part.partTitle}</Card.Title>
            </Card.Header>

            <Card.Body>
                {part.fieldGroups.map((fieldGroup, groupIdx) => (
                    <FieldGroup key={'F' + fieldGroup.group} partIdx={partIdx} groupIdx={groupIdx}></FieldGroup>
                ))}
            </Card.Body>
            <Card.Footer>
                <Button variant="positive" onClick={handleClickSave}>
                    저장
                </Button>
            </Card.Footer>
        </Card>
    );
};

PartEdit.prototype = propTypes;

export default PartEdit;
