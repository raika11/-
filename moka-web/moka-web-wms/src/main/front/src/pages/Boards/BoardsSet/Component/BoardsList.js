import React, { useEffect, useState } from 'react';
import { MokaCard } from '@components';
import { BoardsSetGrid } from '@pages/Boards/BoardsSet/BoardsSetGrid';
import BoardsListSearchBox from './BoardsListSearchBox';
import { useSelector } from 'react-redux';

const BoardsList = () => {
    const { boardType } = useSelector((store) => ({
        boardType: store.boards.boardType,
    }));

    const [cardTitle, setCardTitle] = useState('');

    // store 에 보드 구분으로 목록 타이명을 변경 해준다.
    useEffect(() => {
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
        <>
            <MokaCard width={940} title={`${cardTitle} 게시판 목록`} loading={null} className="mr-gutter" titleClassName="mb-0" bodyClassName="d-flex flex-column">
                <BoardsListSearchBox />
                <BoardsSetGrid />
            </MokaCard>
        </>
    );
};

export default BoardsList;
