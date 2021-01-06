import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaInputLabel } from '@/components';

const SummaryHolidayModal = (props) => {
    const { show, onHide } = props;
    const [status, setStatus] = useState('');
    const [groupName, setGroupName] = useState('');
    const [people, setPeople] = useState('');
    const [applicant, setApplicant] = useState('');
    const [phone, setPhone] = useState('');

    return (
        <MokaModal width={600} title="신청 요약" show={show} onHide={onHide} footerClassName="d-flex justify-content-end" footer={<Button>상세 보기</Button>} draggable>
            <Form>
                <MokaInputLabel
                    label="상태"
                    labelClassName="d-flex justify-content-end"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    inputProps={{ plaintext: true, readOnly: true }}
                />
                <MokaInputLabel
                    label="단체명"
                    labelClassName="d-flex justify-content-end"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    inputProps={{ plaintext: true, readOnly: true }}
                />
                <MokaInputLabel
                    label="견학인원"
                    labelClassName="d-flex justify-content-end"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    inputProps={{ plaintext: true, readOnly: true }}
                />
                <MokaInputLabel
                    label="신청자"
                    labelClassName="d-flex justify-content-end"
                    value={applicant}
                    onChange={(e) => setApplicant(e.target.value)}
                    inputProps={{ plaintext: true, readOnly: true }}
                />
                <MokaInputLabel
                    label="연락처"
                    labelClassName="d-flex justify-content-end"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputProps={{ plaintext: true, readOnly: true }}
                />
                <p className="m-0 ft-12 color-secondary">※ 상세 내용의 확인이나 수정은 상세 보기 버튼을 클릭해주세요.</p>
            </Form>
        </MokaModal>
    );
};

export default SummaryHolidayModal;
