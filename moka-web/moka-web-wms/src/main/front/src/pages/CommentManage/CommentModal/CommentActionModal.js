import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { MokaModal } from '@components';
import { useDispatch } from 'react-redux';
import toast, { messageBox } from '@utils/toastUtil';

import { deleteComment, getCommentList } from '@store/commentManage';

import { BenneConfirmModal } from '@pages/CommentManage/CommentModal';

const CommentActionModal = (props) => {
    const { show, onHide, ModalUsage } = props;
    const { gubun } = ModalUsage;

    const [confirmModalState, setConfirmModalState] = useState(false);
    const dispatch = useDispatch();

    const alertMessage = {
        type_one: '댓글을 삭제 하시겠습니까',
        type_two: '사용자의 과거 댓글 전체를 삭제하시겠습니까',
        type_three: '사용자 ID 차단 및 댓글을 삭제하시겠습니까',
        type_four: '사용자 ID 차단 및 과거 댓글 전체를 삭제 하시겠습니까',
        type_restore: '댓글을 복구하시겠습니까',
    };

    const handleClickHide = () => {
        onHide();
    };

    // 댓글 삭제 처리. (댓글만.)
    const handleDeleteComment = () => {
        dispatch(
            deleteComment({
                cmtSeq: ModalUsage.cmtSeq,
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

    /*
     * 2021-01-22 10:53  댓글만 삭제 기능 외에는 API 가 없기 떄문에
     * 추후에 API 및 처리 논의.
     */
    // 사용자 과거 댓글 전체 삭제.
    const handleDeleteAllUserComment = () => {
        messageBox.alert('개발 중입니다.');
    };
    // 사용자 ID 차단 및 댓글 삭제.
    const handleUserBenneCommentDelete = () => {
        messageBox.alert('개발 중입니다.');
    };
    // 사용자 ID 차단 및 과거 댓글 전체를 삭제 하시겠습니까
    const handleUserBenneCommentAllDelete = () => {
        messageBox.alert('개발 중입니다.');
    };

    const handleClickSave = () => {
        if (gubun === 'type_one') {
            handleDeleteComment();
        } else if (gubun === 'type_two') {
            handleDeleteAllUserComment();
        } else if (gubun === 'type_three') {
            handleUserBenneCommentDelete();
        } else if (gubun === 'type_four') {
            handleUserBenneCommentAllDelete();
        }

        onHide();
    };

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleClickHide}
            title={`댓글 삭제`}
            size="md"
            buttons={[
                { text: '확인', variant: 'positive', onClick: () => handleClickSave() },
                { text: '취소', variant: 'negative', onClick: () => handleClickHide() },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <Form.Row className="mb-2">{alertMessage[gubun]}</Form.Row>
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
