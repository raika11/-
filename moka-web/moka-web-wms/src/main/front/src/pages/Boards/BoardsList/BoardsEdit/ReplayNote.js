import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Form, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import BoardsSummernote from './BoardsSummernote';
import toast, { messageBox } from '@utils/toastUtil';
import { GET_LIST_MENU_CONTENTS_INFO, changeListMenuReplyContent, uploadBoardContentImage } from '@store/board';

const BoardsNote = () => {
    const { boardId, boardSeq, parentBoardSeq, reply } = useParams();
    const dispatch = useDispatch();
    const { contentsinfo, contentsreply, selectBoard } = useSelector((store) => ({
        contentsinfo: store.board.listMenu.contents.info,
        contentsreply: store.board.listMenu.contents.reply,
        selectBoard: store.board.listMenu.selectBoard,
        loading: store.loading[GET_LIST_MENU_CONTENTS_INFO],
    }));

    const [contentData, setContentData] = useState(null);

    const SummernoteImageUpload = (file) => {
        const formData = new FormData();
        formData.append('attachFile', file[0]);

        dispatch(
            uploadBoardContentImage({
                boardId: selectBoard.boardId,
                imageForm: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        let tempContent = `${contentsreply.content} <img src="${body}">`;

                        dispatch(changeListMenuReplyContent({ content: tempContent }));
                        setContentData(tempContent);
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // body에 에러메시지가 없으면 서버 메시지를 alert 함.
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    useEffect(() => {
        if (!boardSeq && parentBoardSeq) {
            let tempContent = `
            <br/>
            원본 게시글<br/>
            ------------------------------------------------------<br/>
            <br/>
            ${contentsinfo.content}`;

            setContentData(tempContent);
        } else if (boardSeq && parentBoardSeq && reply) {
            setContentData(contentsreply.content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardSeq, parentBoardSeq]);

    return (
        <>
            <Form.Row className="mb-2">
                <Col className="p-0">
                    <BoardsSummernote
                        contentValue={contentData}
                        editChange={(value) => {
                            dispatch(changeListMenuReplyContent({ content: value }));
                        }}
                        editImageUpload={(e) => SummernoteImageUpload(e)}
                    />
                </Col>
            </Form.Row>
        </>
    );
};

export default BoardsNote;
