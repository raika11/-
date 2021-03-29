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
const BoardsNote = ({ data, onChangeFormData, jpodBoardId }) => {
    const dispatch = useDispatch();
    const { boardId } = useParams();
    const contentsInfo = useSelector((store) => store.board.listMenu.contents.info);
    const jpodContents = useSelector((store) => store.jpod.jpodNotice.contents);
    const [noteData, setNoteData] = useState(data);

    /**
     * summernote 이미지 업로드 처리
     */
    const summerNoteImageUpload = (files) => {
        const formData = new FormData();
        formData.append('attachFile', files[0]);

        dispatch(
            uploadBoardContentsImage({
                boardId: boardId || jpodBoardId,
                imageForm: formData,
                callback: ({ header, body }) => {
                    if (header.success) {
                        let tempContent = `${contentsInfo.content || jpodContents.content} <img src="${body}">`;
                        onChangeFormData({ content: tempContent });
                    } else {
                        if (Array.isArray(body.list)) {
                            // 에러 메시지 확인
                            messageBox.alert(body.list[0].reason, () => {});
                        } else {
                            // body에 에러메시지가 없으면 서버 메시지를 alert
                            messageBox.alert(header.message, () => {});
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
                        setNoteData(value);
                    }}
                    onImageUpload={(e) => summerNoteImageUpload(e)}
                />
            </Col>
        </Form.Row>
    );
};

export default BoardsNote;
