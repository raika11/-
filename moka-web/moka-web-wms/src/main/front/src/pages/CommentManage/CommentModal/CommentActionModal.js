import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MokaModal } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { deleteComment, getCommentList } from '@store/commentManage';
import { BannedConfirmModal } from '@pages/CommentManage/CommentModal';

/**
 * 댓글 관리 > 댓글 액션 모달
 */
const CommentActionModal = (props) => {
    const { show, onHide, modalUsage } = props;
    const { deleteType } = modalUsage;
    // console.log(modalUsage);

    const [confirmModalState, setConfirmModalState] = useState(false);
    const dispatch = useDispatch();

    const alertMessage = {
        CMT: '댓글을 삭제하시겠습니까?',
        ALL: '사용자의 과거 댓글 전체를 삭제하시겠습니까?',
        BNC: '사용자 ID 차단 및 댓글을 삭제하시겠습니까?',
        BNA: '사용자 ID 차단 및 과거 댓글 전체를 삭제하시겠습니까?',
        restore: '댓글을 복구하시겠습니까?',
    };

    /**
     * 댓글 삭제
     * - 삭제 유형 -
     *   댓글하나 : CMT
     *   사용자 댓글 모두 : ALL
     *   사용자 차단과 해당 댓글 삭제 : BNC
     *   사용자 차단과 해당 댓글 삭제 : BNA
     */
    const handleClickSave = () => {
        const paramsStatusType = deleteType === 'restore' ? 'A' : 'N';
        const paramsDeleteType = deleteType === 'restore' ? null : deleteType;
        dispatch(
            deleteComment({
                cmtSeq: modalUsage.cmtSeq,
                params: {
                    statusType: paramsStatusType,
                    deleteType: paramsDeleteType,
                },
                callback: ({ header: { success, message }, body }) => {
                    if (success) {
                        toast.success(message);
                        onHide();
                        dispatch(getCommentList());
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    return (
        <MokaModal
            size="sm"
            width={400}
            show={show}
            onHide={onHide}
            title={deleteType === 'restore' ? `댓글 복구` : `댓글 삭제`}
            buttons={[
                { text: '확인', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: onHide },
            ]}
            draggable
        >
            <p className="mb-0">{alertMessage[deleteType]}</p>
            {/* <BannedConfirmModal
                modalUsage={modalUsage}
                show={confirmModalState}
                onHide={() => {
                    setConfirmModalState(false);
                }}
            /> */}
        </MokaModal>
    );
};

export default CommentActionModal;
