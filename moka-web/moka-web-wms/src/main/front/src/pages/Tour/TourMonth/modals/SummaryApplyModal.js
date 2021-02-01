import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInputLabel } from '@/components';

const SummaryApplyModal = (props) => {
    const { show, onHide, data } = props;
    const [status, setStatus] = useState('');

    /**
     * 상세 보기 버튼
     */
    const handleClickTour = () => {
        window.open(`tour-list/${data.tourSeq}`);
    };

    useEffect(() => {
        if (data.tourStatus) {
            if (data.tourStatus === 'S') {
                setStatus('대기');
            } else if (data.tourStatus === 'A') {
                setStatus('확정');
            }
        }
    }, [data.tourStatus]);

    return (
        <MokaModal size="md" title="신청 요약" show={show} onHide={onHide} buttons={[{ text: '상세 보기', variant: 'positive', onClick: handleClickTour }]} centered>
            <Form>
                <MokaInputLabel label="상태" className="mb-2" value={status} inputProps={{ plaintext: true, readOnly: true }} />
                <MokaInputLabel label="단체명" className="mb-2" value={data.tourGroupNm} inputProps={{ plaintext: true, readOnly: true }} />
                <MokaInputLabel label="견학인원" className="mb-2" value={data.tourPersons} inputProps={{ plaintext: true, readOnly: true }} />
                <MokaInputLabel label="신청자" className="mb-2" value={data.writerNm} inputProps={{ plaintext: true, readOnly: true }} />
                <MokaInputLabel label="연락처" className="mb-2" value={data.writerPhone} inputProps={{ plaintext: true, readOnly: true }} />
                <p className="color-secondary mb-0">※ 상세 내용의 확인이나 수정은 상세 보기 버튼을 클릭해주세요.</p>
            </Form>
        </MokaModal>
    );
};

export default SummaryApplyModal;
