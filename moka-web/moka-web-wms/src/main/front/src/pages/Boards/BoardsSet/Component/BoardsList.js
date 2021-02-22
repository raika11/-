import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MokaCard } from '@components';
import { BoardsSetGrid } from '@pages/Boards/BoardsSet/BoardsSetGrid';
import BoardsListSearchBox from './BoardsListSearchBox';

/**
 * 전체 게시판
 */
const BoardsList = () => {
    const { boardType } = useSelector((store) => ({
        boardType: store.board.boardType,
    }));
    const [cardTitle, setCardTitle] = useState('');

    useEffect(() => {
        // store 에 보드 구분으로 목록 타이명을 변경 해준다.
        const setMokaCardTitle = () => {
            let title = '';
            if (boardType === 'S') {
                title = '서비스';
            } else if (boardType === 'A') {
                title = '관리자';
            }
            setCardTitle(title);
        };

        setMokaCardTitle();
    }, [boardType]);

    return (
        <MokaCard width={850} title={`${cardTitle} 게시판 목록`} className="mr-gutter" bodyClassName="d-flex flex-column">
            <BoardsListSearchBox />
            <BoardsSetGrid />
        </MokaCard>
    );
};

export default BoardsList;
