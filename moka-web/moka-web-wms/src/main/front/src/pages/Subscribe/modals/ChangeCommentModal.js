import React, { useState, useEffect } from 'react';
import common from '@utils/commonUtil';
import { messageBox } from '@utils/toastUtil';
import { MokaModal, MokaInput } from '@components';

/**
 * 구독 관리 > 구독 설계 > 변경 사유 모달
 */
const ChangeCommentModal = ({ show, onHide, onSave }) => {
    const [comment, setComment] = useState('');

    /**
     * 저장
     */
    const handleSave = () => {
        if (common.isEmpty(comment)) {
            messageBox.alert('변경 사유를 입력해주세요');
        } else if (comment.length > 100) {
            messageBox.alert('100자 이내로 입력해주세요');
        } else {
            if (onSave) onSave(comment);
        }
    };

    useEffect(() => {
        if (!show) setComment('');
    }, [show]);

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            title="변경 사유"
            buttons={[
                {
                    text: '확인',
                    variant: 'positive',
                    onClick: handleSave,
                },
                {
                    text: '취소',
                    variant: 'negative',
                    onClick: onHide,
                },
            ]}
            size="md"
            width={500}
            centered
        >
            <MokaInput as="textarea" inputProps={{ rows: 4 }} placeholder="변경 사유를 입력하세요 (100자 이내)" value={comment} onChange={(e) => setComment(e.target.value)} />
        </MokaModal>
    );
};

export default ChangeCommentModal;
