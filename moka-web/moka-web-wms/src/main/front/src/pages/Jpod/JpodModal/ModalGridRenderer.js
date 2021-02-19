import React from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { selectReporter } from '@store/jpod';

// 팟티 채널 새창 이동 버튼
export const ChannelMoveButtonRenderer = ({ shareUrl }) => {
    const handleClickMoveButton = () => {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };
    return (
        <div className="h-100 d-flex jutify-content-center align-items-center">
            <Button variant="outline-table-btn" size="sm" onClick={handleClickMoveButton}>
                이동
            </Button>
        </div>
    );
};

// 진행자 검색시 해당 값을 스토어에 업데이트 해준다.
export const RepoterAddButtonRenderer = ({ repoterInfo }) => {
    const dispatch = useDispatch();

    const handleClickButton = () => {
        dispatch(selectReporter(repoterInfo));
    };

    return (
        <div className="h-100 d-flex jutify-content-center align-items-center">
            <Button variant="outline-table-btn" size="sm" onClick={handleClickButton}>
                등록
            </Button>
        </div>
    );
};
