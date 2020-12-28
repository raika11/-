import React, { useEffect, useState } from 'react';
import { MokaCard } from '@components';
import { BoardsSetGrid } from '@pages/Boards/BoardsSet/BoardsSetGrid';
import BoardsListSearchBox from './BoardsListSearchBox';
import { useSelector, useDispatch } from 'react-redux';

const BoardsList = () => {
    const { boardType } = useSelector((store) => ({
        boardType: store.boards.boardType,
    }));

    const [cardTitle, setCardTitle] = useState('');

    useEffect(() => {
        const setMokaCardTitle = () => {
            let title = '';
            if (boardType === 'S') {
                title = '시스템';
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
