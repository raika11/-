import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaInputLabel, MokaModal } from '@components';
import { Col } from 'react-bootstrap';
import { saveEditFormPart } from '@/store/editForm';
import toast from '@/utils/toastUtil';
import { DB_DATEFORMAT } from '@/constants';
import moment from 'moment';

/**
 * 폼 Publish 설정 Modal
 */
const EditFormPartPublishModal = (props) => {
    const { show, onHide, componentSeq } = props;
    const dispatch = useDispatch();
    const history = useHistory();

    const [reserveDtError, setReserveDtError] = useState(false);
    const [reserve, setReserve] = useState('N');
    const [reserveDt, setReserveDt] = useState(new Date());

    const { editFormPart } = useSelector((store) => ({
        editFormPart: store.editForm.editFormPart,
    }));

    /**
     * 닫기
     */
    const handleHide = () => {
        onHide();
    };

    const handleChangeValue = async (event) => {
        const target = event.target;
        const value = target.value;
        await setReserve(value);
    };

    const handleReserveDt = async (date) => {
        await setReserveDt(date);
    };

    /**
     * 퍼블리시
     */
    const handlePublish = () => {
        dispatch(
            saveEditFormPart({
                type: 'update',
                formSeq: editFormPart.formSeq,
                partSeq: editFormPart.partSeq,
                partJson: {
                    partId: editFormPart.partId,
                    partTitle: editFormPart.partTitle,
                    usedYn: editFormPart.useYn,
                    reserveDt: reserve === 'Y' ? moment(reserveDt).format(DB_DATEFORMAT) : null,
                    status: 'PUBLISH',
                    formData: JSON.stringify(editFormPart.fieldGroups),
                },
                callback: (response) => {
                    toast.result(response, () => {
                        handleHide();
                    });
                },
            }),
        );
    };

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleHide}
            title={`${editFormPart && editFormPart.partTitle} Publish`}
            size="md"
            buttons={[
                { text: '저장', variant: 'positive', onClick: handlePublish },
                { text: '취소', variant: 'negative', onClick: handleHide },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col xs={2}>
                        <MokaInputLabel
                            as="radio"
                            inputProps={{
                                custom: true,
                                label: '바로적용',
                                checked: reserve === 'N',
                            }}
                            id="publish-direct"
                            name="reserve"
                            onChange={handleChangeValue}
                            value="N"
                            className="mb-0 h-100"
                            required
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={2}>
                        <MokaInputLabel
                            as="radio"
                            inputProps={{
                                custom: true,
                                label: '예약',
                                checked: reserve === 'Y',
                            }}
                            id="publish-reserve"
                            name="reserve"
                            onChange={handleChangeValue}
                            value="Y"
                            className="mb-0 h-100"
                            required
                        />
                    </Col>
                    <Col xs={10}>
                        <MokaInputLabel
                            as="dateTimePicker"
                            className="mb-2"
                            labelWidth={108}
                            inputProps={{ dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm:ss' }}
                            name="reserveDt"
                            value={reserveDt}
                            onChange={handleReserveDt}
                            isInvalid={reserveDtError}
                            disabled={reserve === 'Y' ? false : true}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </MokaModal>
    );
};

export default EditFormPartPublishModal;
