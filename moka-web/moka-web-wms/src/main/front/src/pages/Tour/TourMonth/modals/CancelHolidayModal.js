import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { MokaModal } from '@/components';
import { deleteTourDeny } from '@/store/tour';
import toast, { messageBox } from '@/utils/toastUtil';

const CancelHolidayModal = (props) => {
    const { show, onHide, data } = props;
    const dispatch = useDispatch();

    const handleClickConfirm = useCallback(() => {
        if (data.denySeq && data.denyRepeatYn === 'N') {
            dispatch(
                deleteTourDeny({
                    denySeq: data.denySeq,
                    callback: ({ header, body }) => {
                        if (header.success && body) {
                            toast.success('휴일 지정이 해제되었습니다.');
                            onHide();
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        }
    }, [data.denyRepeatYn, data.denySeq, dispatch, onHide]);

    return (
        <MokaModal
            width={400}
            size="md"
            title="휴일 지정 해제"
            show={show}
            onHide={onHide}
            buttons={[
                { text: '확인', variant: 'positive', onClick: handleClickConfirm },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            centered
        >
            <p className="mb-0">확인을 클릭하시면 휴일 지정이 해제됩니다.</p>
        </MokaModal>
    );
};

export default CancelHolidayModal;
