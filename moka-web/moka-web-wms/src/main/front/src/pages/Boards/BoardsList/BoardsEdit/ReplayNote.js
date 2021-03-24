import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Form, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import BoardsSummernote from './BoardsSummernote';
import toast, { messageBox } from '@utils/toastUtil';
import { uploadBoardContentsImage } from '@store/board';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 편집 폼 > 게시글 답변 썸머노트 편집
 */
const ReplyNote = ({ data, onChangeFormData }) => {
    const dispatch = useDispatch();
    const { boardId } = useParams();
    const contentsReply = useSelector((store) => store.board.listMenu.contents.reply);
    const [noteData, setNoteData] = useState(data);

    /**
     * summernote 이미지 업로드 처리
     */
    const SummernoteImageUpload = (files) => {
        const formData = new FormData();
        formData.append('attachFile', files[0]);

        dispatch(
            uploadBoardContentsImage({
                boardId: boardId,
                imageForm: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        let tempContent = `${contentsReply.content} <img src="${body}">`;

                        onChangeFormData({ content: tempContent });
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
        onChangeFormData({ content: noteData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteData]);

    return (
        <Form.Row className="mb-2">
            <Col className="p-0">
                <BoardsSummernote
                    contentValue={data}
                    onChangeValue={(value) => {
                        setNoteData(value);
                    }}
                    onImageUpload={(e) => SummernoteImageUpload(e)}
                />
            </Col>
        </Form.Row>
    );
};

export default ReplyNote;
