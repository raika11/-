import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInputLabel } from '@/components';

const SetHolidayModal = (props) => {
    const { show, onHide } = props;
    const [holidayName, setHolidayName] = useState('');

    return (
        <MokaModal
            size="md"
            // width={600}
            title="휴일 지정"
            show={show}
            onHide={onHide}
            buttons={[
                { text: '확인', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            centered
            draggable
        >
            <Form>
                <MokaInputLabel label="휴일명" className="mb-2" value={holidayName} onChange={(e) => setHolidayName(e.target.value)} />
                <p className="color-secondary mb-0">※ 휴일명을 입력하시면 사용자 화면에서 입력하신 휴일명이 표기됩니다. (기본: 신청 마감)</p>
            </Form>
        </MokaModal>
    );
};

export default SetHolidayModal;
