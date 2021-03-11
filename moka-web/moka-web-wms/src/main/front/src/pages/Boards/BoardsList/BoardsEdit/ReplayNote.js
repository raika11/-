import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import BoardsSummernote from './BoardsSummernote';
import toast, { messageBox } from '@utils/toastUtil';
import { GET_LISTMENU_CONTENTS_INFO, changeListmenuReplyContent, uploadBoardContentImage } from '@store/board';

const BoardsNote = ({ EditState }) => {
    const dispatch = useDispatch();
    const { contentsinfo, contentsreply, selectboard } = useSelector((store) => ({
        contentsinfo: store.board.listmenu.contents.info,
        contentsreply: store.board.listmenu.contents.reply,
        selectboard: store.board.listmenu.selectboard,
        loading: store.loading[GET_LISTMENU_CONTENTS_INFO],
    }));

    const [contentData, setContentData] = useState(null);

    const SummernoteImageUpload = (file) => {
        const formData = new FormData();
        formData.append('attachFile', file[0]);

        dispatch(
            uploadBoardContentImage({
                boardId: selectboard.boardId,
                imageForm: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        let tempContent = `${contentsreply.content} <img src="${body}">`;

                        dispatch(changeListmenuReplyContent({ content: tempContent }));
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
        if (EditState.mode === 'add') {
            let tempContent = `
            <br/>
            원본 게시글<br/>
            ------------------------------------------------------<br/>
            <br/>
            ${contentsinfo.content}`;

            setContentData(tempContent);
        } else {
            setContentData(contentsreply.content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EditState]);

    return (
        <>
            <Form.Row className="mb-2">
                <Col className="p-0">
                    <BoardsSummernote
                        contentValue={contentData}
                        editChange={(value) => {
                            dispatch(changeListmenuReplyContent({ content: value }));
                        }}
                        editImageUpload={(e) => SummernoteImageUpload(e)}
                    />
                </Col>
            </Form.Row>
        </>
    );
};

export default BoardsNote;
