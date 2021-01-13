import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { selectReporter } from '@store/jpod';
import { useDispatch } from 'react-redux';

// 팟티 채널 새창 이동 버튼
export const ChannelMoveButtonRenderer = ({ shareUrl }) => {
    const handleClickMoveButton = () => {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };
    return (
        <>
            <Col className="pt-2">
                <Button variant="negative" onClick={() => handleClickMoveButton()}>
                    이동
                </Button>
            </Col>
        </>
    );
};

// 진행자 검색시 해당 값을 스토어에 업데이트 해준다.
export const RepoterAddButtonRenderer = ({ repoterInfo }) => {
    const dispatch = useDispatch();

    const handleClickButton = () => {
        dispatch(selectReporter(repoterInfo));
        dispatch(selectReporter(repoterInfo));
    };
    return (
        <>
            <Col className="pt-2">
                <Button variant="negative" onClick={() => handleClickButton()}>
                    등록
                </Button>
            </Col>
        </>
    );
};
