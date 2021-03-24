import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { uploadBoardContentsImage } from '@store/board';
import { messageBox } from '@utils/toastUtil';
import BoardsSummernote from './BoardsSummernote';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 편집 폼 > 게시글 썸머노트 편집
 */
const BoardsNote = ({ data, onChangeFormData }) => {
    const dispatch = useDispatch();
    const { boardId } = useParams();
    const contentsInfo = useSelector((store) => store.board.listMenu.contents.info);
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
                        let tempContent = `${contentsInfo.content} <img src="${body}">`;
                        // dispatch(changeListMenuContents({ content: tempContent }));
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
        <Form.Row className="mb-4">
            <Col className="p-0">
                <BoardsSummernote
                    contentValue={data}
                    onChangeValue={(value) => {
                        // dispatch(changeListMenuContents({ content: value }));
                        setNoteData(value);
                    }}
                    onImageUpload={(e) => SummernoteImageUpload(e)}
                />
            </Col>
        </Form.Row>
    );
};

export default BoardsNote;
