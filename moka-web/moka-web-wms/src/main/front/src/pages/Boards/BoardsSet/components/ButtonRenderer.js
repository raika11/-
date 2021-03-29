import React from 'react';
import Button from 'react-bootstrap/Button';
import { messageBox } from '@utils/toastUtil';

/**
 * 게시판 버튼
 */
const ButtonRenderer = ({ value: { boardId, boardUrl } }) => {
    return (
        <div className="d-flex align-items-center h-100">
            <Button
                variant="outline-table-btn"
                className="mr-1"
                onClick={() => {
                    window.open(process.env.PUBLIC_URL + `/boards-list/${boardId}`);
                }}
                size="sm"
            >
                게시글 관리
            </Button>
            <Button
                variant="outline-table-btn"
                className="mr-0"
                onClick={() => {
                    if (boardUrl) {
                        window.open(boardUrl);
                    } else {
                        messageBox.alert('서비스 준비 중입니다.');
                    }
                }}
                size="sm"
                disabled={boardUrl ? false : true}
            >
                프론트 확인
            </Button>
        </div>
    );
};

export default ButtonRenderer;
