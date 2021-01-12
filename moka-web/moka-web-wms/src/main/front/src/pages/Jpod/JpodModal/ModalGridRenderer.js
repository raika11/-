import React, { useEffect } from 'react';
import { Button, Col } from 'react-bootstrap';
import { selectReporter } from '@store/jpod';
import { useSelector, useDispatch } from 'react-redux';

// 등록자 정보
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

export const RepoterAddButtonRenderer = ({ repoterInfo }) => {
    const dispatch = useDispatch();

    const handleClickButton = () => {
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
