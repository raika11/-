import React from 'react';
import Button from 'react-bootstrap/Button';
import { MokaModal } from '@/components';

const CancelHolidayModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal
            width={400}
            title="휴일 지정 취소"
            show={show}
            onHide={onHide}
            headerClassName="d-flex justify-content-start"
            bodyClassName="pb-0"
            footerClassName="border-top-0 d-flex justify-content-center"
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
            <p className="m-0">확인을 클릭하시면 휴일 지정이 해제됩니다.</p>
        </MokaModal>
    );
};

export default CancelHolidayModal;
