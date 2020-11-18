import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import FieldGroup from './FieldGroup';
import { EditFormPartsContext } from './EditFormEdit';

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

    const editFormPartsContext = useContext(EditFormPartsContext);
    const part = editFormPartsContext[partIdx];

    const handleClickSave = (event) => {
        console.log(part);
        insertEditFormPart({ partJson: JSON.stringify(part) });
    };

    const insertEditFormPart = (tmp) => {
        console.log(JSON.stringify(part));
        /*
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
        */
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
                <Button variant="primary" onClick={handleClickSave}>
                    저장
                </Button>
            </Card.Footer>
        </Card>
    );
};

PartEdit.prototype = propTypes;

export default PartEdit;
