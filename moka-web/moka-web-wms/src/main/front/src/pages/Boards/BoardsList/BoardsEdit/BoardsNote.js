import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { uploadBoardContentsImage, changeListMenuContents } from '@store/board';
import toast, { messageBox } from '@utils/toastUtil';
import BoardsSummernote from './BoardsSummernote';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 편집 폼 > 게시글 썸머노트 편집
 */
const BoardsNote = ({ data, onChangeFormData }) => {
    const dispatch = useDispatch();
    const contentsInfo = useSelector((store) => store.board.listMenu.contents.info);
    const selectBoard = useSelector((store) => store.board.listMenu.selectBoard);

    const [contentsData, setContentsData] = useState(data);

    /**
     * summernote 이미지 업로드 처리
     */
    const SummernoteImageUpload = (files) => {
        const formData = new FormData();
        formData.append('attachFile', files[0]);

        dispatch(
            uploadBoardContentsImage({
                boardId: selectBoard.boardId,
                imageForm: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        let tempContent = `${contentsInfo.content} <img src="${body}">`;
                        // dispatch(changeListMenuContents({ content: tempContent }));
                        setContentsData(tempContent);
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
        setContentsData(data);
    }, [data]);

    useEffect(() => {
        onChangeFormData({
            target: {
                name: 'content',
                value: contentsData,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentsData]);

    return (
        <Form.Row className="mb-2">
            <Col className="p-0">
                <BoardsSummernote
                    contentValue={contentsData}
                    onChangeValue={(value) => {
                        // dispatch(changeListMenuContents({ content: value }));
                        setContentsData(value);
                    }}
                    onImageUpload={(e) => SummernoteImageUpload(e)}
                />
            </Col>
        </Form.Row>
    );
};

export default BoardsNote;
