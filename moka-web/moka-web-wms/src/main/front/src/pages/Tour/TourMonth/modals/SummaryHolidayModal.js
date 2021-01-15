import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInputLabel } from '@/components';

const SummaryHolidayModal = (props) => {
    const { show, onHide } = props;
    const [status, setStatus] = useState('');
    const [groupName, setGroupName] = useState('');
    const [people, setPeople] = useState('');
    const [applicant, setApplicant] = useState('');
    const [phone, setPhone] = useState('');

    /**
     * 상세 보기 버튼
     */
    const handleClickTour = () => {
        window.open(`/tour-list/158`);
    };

    return (
        <MokaModal width={500} size="md" title="신청 요약" show={show} onHide={onHide} buttons={[{ text: '상세 보기', variant: 'positive', onClick: handleClickTour }]} centered>
            <Form>
                <MokaInputLabel label="상태" className="mb-2" value={status} onChange={(e) => setStatus(e.target.value)} inputProps={{ plaintext: true, readOnly: true }} />
                <MokaInputLabel label="단체명" className="mb-2" value={groupName} onChange={(e) => setGroupName(e.target.value)} inputProps={{ plaintext: true, readOnly: true }} />
                <MokaInputLabel label="견학인원" className="mb-2" value={people} onChange={(e) => setPeople(e.target.value)} inputProps={{ plaintext: true, readOnly: true }} />
                <MokaInputLabel label="신청자" className="mb-2" value={applicant} onChange={(e) => setApplicant(e.target.value)} inputProps={{ plaintext: true, readOnly: true }} />
                <MokaInputLabel label="연락처" className="mb-2" value={phone} onChange={(e) => setPhone(e.target.value)} inputProps={{ plaintext: true, readOnly: true }} />
                <p className="color-secondary mb-0">※ 상세 내용의 확인이나 수정은 상세 보기 버튼을 클릭해주세요.</p>
            </Form>
        </MokaModal>
    );
};

export default SummaryHolidayModal;
