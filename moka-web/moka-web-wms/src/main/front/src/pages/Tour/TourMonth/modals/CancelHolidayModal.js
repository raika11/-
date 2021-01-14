import React from 'react';
import { MokaModal } from '@/components';

const CancelHolidayModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal
            width={400}
            size="md"
            title="휴일 지정 취소"
            show={show}
            onHide={onHide}
            buttons={[
                { text: '저장', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            centered
        >
            <p className="mb-0">확인을 클릭하시면 휴일 지정이 해제됩니다.</p>
        </MokaModal>
    );
};

export default CancelHolidayModal;
