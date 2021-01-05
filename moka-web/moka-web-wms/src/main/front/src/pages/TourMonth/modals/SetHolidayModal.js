import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaInputLabel } from '@/components';

const SetHolidayModal = (props) => {
    const { show, onHide } = props;
    const [holidayName, setHolidayName] = useState('');

    return (
        <MokaModal
            width={400}
            title="휴일 지정"
            show={show}
            onHide={onHide}
            headerClassName="d-flex justify-content-start"
            footerClassName="d-flex justify-content-center"
            footer={
                <>
                    <Button className="mr-2">저장</Button>
                    <Button variant="negative" onClick={() => onHide()}>
                        취소
                    </Button>
                </>
            }
            draggable
        >
            <Form>
                <MokaInputLabel label="휴일명" className="mb-0" value={holidayName} onChange={(e) => setHolidayName(e.target.value)} />
                <p className="m-0 ft-12 color-secondary">※ 휴일명을 입력하시면 사용자 화면에서 입력하신 휴일명이 표기됩니다.(기본: 신청 마감)</p>
            </Form>
        </MokaModal>
    );
};

export default SetHolidayModal;
