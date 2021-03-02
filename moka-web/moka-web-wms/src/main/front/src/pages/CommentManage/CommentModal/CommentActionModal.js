import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { MokaModal } from '@components';
import { useDispatch } from 'react-redux';
import toast, { messageBox } from '@utils/toastUtil';

import { deleteComment, getCommentList, clearComment } from '@store/commentManage';

import { BenneConfirmModal } from '@pages/CommentManage/CommentModal';

const CommentActionModal = (props) => {
    const { show, onHide, ModalUsage } = props;
    const { deleteType } = ModalUsage;

    const [confirmModalState, setConfirmModalState] = useState(false);
    const dispatch = useDispatch();

    const alertMessage = {
        CMT: '댓글을 삭제 하시겠습니까',
        ALL: '사용자의 과거 댓글 전체를 삭제하시겠습니까',
        BNC: '사용자 ID 차단 및 댓글을 삭제하시겠습니까',
        BNA: '사용자 ID 차단 및 과거 댓글 전체를 삭제 하시겠습니까',
        restore: '댓글을 복구하시겠습니까',
    };

    const handleClickHide = () => {
        onHide();
    };

    /*
        - 삭제 유형 -
        댓글하나 : CMT
        사용자 댓글 모두 : ALL
        사용자 차단과 해당 댓글 삭제 : BNC
        사용자 차단과 해당 댓글 삭제 : BNA
    */
    // 댓글 삭제 처리.
    const handleDeleteComment = (type) => {
        const paramsStatusType = type === 'restore' ? 'A' : 'N';
        const paramsDeleteType = type === 'restore' ? '' : type;
        // dispatch(clearComment());
        dispatch(
            deleteComment({
                cmtSeq: ModalUsage.cmtSeq,
                params: {
                    statusType: paramsStatusType,
                    deleteType: paramsDeleteType,
                },
                callback: ({ header: { success, message }, body }) => {
                    // 임시로 모두 다시 가지고 옴.
                    dispatch(getCommentList());
                    if (success === true) {
                        toast.success(message);
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

    const handleClickSave = () => {
        handleDeleteComment(deleteType);

        onHide();
    };

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleClickHide}
            title={deleteType === 'restore' ? `댓글 복구` : `댓글 삭제`}
            size="md"
            buttons={[
                { text: '확인', variant: 'positive', onClick: () => handleClickSave() },
                { text: '취소', variant: 'negative', onClick: () => handleClickHide() },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <Form.Row className="mb-2">{alertMessage[deleteType]}</Form.Row>
            </Form>
            <BenneConfirmModal
                ModalUsage={ModalUsage}
                show={confirmModalState}
                onHide={() => {
                    setConfirmModalState(false);
                }}
            />
        </MokaModal>
    );
};

export default CommentActionModal;
