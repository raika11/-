import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FieldGroup from './FieldGroup';
import { exportEditFormPartXml, saveEditFormPart, showHistoryModal, showPublishModal } from '@/store/editForm';
import toast from '@/utils/toastUtil';

const propTypes = {
    part: PropTypes.any,
    formId: PropTypes.string,
};
/**
 * 기본 input
 */
const PartEdit = (props) => {
    const { partIdx } = props;
    const dispatch = useDispatch();

    const { editFormParts } = useSelector((store) => ({
        editFormParts: store.editForm.editFormParts,
    }));

    const part = editFormParts[partIdx];

    const handleClickSave = (event) => {
        insertEditFormPart({ partJson: JSON.stringify(part) });
    };

    const handleClickPublish = () => {
        dispatch(showPublishModal(true, part));
    };

    const handleClickHistoryOpen = () => {
        dispatch(showHistoryModal(true, part, partIdx));
    };

    const handleClickExport = () => {
        console.log(part);
        dispatch(exportEditFormPartXml(part));
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
                {part.fieldGroups && part.fieldGroups.map((fieldGroup, groupIdx) => <FieldGroup key={'F' + fieldGroup.group} partIdx={partIdx} groupIdx={groupIdx}></FieldGroup>)}
            </Card.Body>
            <Card.Footer>
                <Form.Group className="mb-3 d-flex justify-content-between">
                    <div className="d-flex">
                        <Button className="float-left mr-10 pr-20 pl-20" variant="negative" onClick={handleClickSave}>
                            임시저장
                        </Button>
                        <Button variant="outline-neutral" className="mr-05" onClick={handleClickHistoryOpen}>
                            복구
                        </Button>
                    </div>
                    <div className="d-flex">
                        <Button className="float-left mr-10 pr-20 pl-20" variant="negative" title="XML Export" onClick={handleClickExport}>
                            Export
                        </Button>
                        <Button className="float-left mr-10 pr-20 pl-20" variant="positive" onClick={handleClickPublish}>
                            퍼블리시
                        </Button>
                    </div>
                </Form.Group>
            </Card.Footer>
        </Card>
    );
};

PartEdit.prototype = propTypes;

export default PartEdit;
