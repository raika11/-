import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import BoardsSummernote from './BoardsSummernote';
import { GET_LISTMENU_CONTENTS_INFO, uploadBoardContentImage, changeListmenuContent } from '@store/board';
import toast, { messageBox } from '@utils/toastUtil';

const BoardsNote = () => {
    const dispatch = useDispatch();
    const { contentsinfo, selectboard } = useSelector((store) => ({
        contentsinfo: store.board.listmenu.contents.info,
        selectboard: store.board.listmenu.selectboard,
        loading: store.loading[GET_LISTMENU_CONTENTS_INFO],
    }));

    const [contentData, setContentData] = useState(null);

    // summernote 이미지 업로드 처리.
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
                        let tempContent = `${contentsinfo.content} <img src="${body}">`;

                        dispatch(changeListmenuContent({ content: tempContent }));
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
        if (contentData === null) {
            setContentData(contentsinfo.content);
        } else if (contentData !== null && contentsinfo.content === null) {
            setContentData('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentsinfo]);

    return (
        <>
            <Form.Row className="mb-2">
                <Col className="p-0">
                    <BoardsSummernote
                        contentValue={contentData}
                        editChange={(value) => {
                            dispatch(changeListmenuContent({ content: value }));
                            // setContentData(value);
                        }}
                        editImageUpload={(e) => SummernoteImageUpload(e)}
                    />
                </Col>
            </Form.Row>
        </>
    );
};

export default BoardsNote;
