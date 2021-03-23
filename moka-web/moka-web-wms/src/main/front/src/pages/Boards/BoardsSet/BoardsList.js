import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MokaCard } from '@components';
import Search from './BoardsListSearch';
import AgGrid from './BoardsSetAgGrid';

/**
 * 게시판 관리 > 전체 게시판 리스트
 */
const BoardsList = ({ match }) => {
    const boardType = useSelector((store) => store.board.boardType);
    const [cardTitle, setCardTitle] = useState('');

    useEffect(() => {
        // 타이틀 변경
        if (boardType === 'S') {
            setCardTitle('서비스');
        } else if (boardType === 'A') {
            setCardTitle('관리자');
        }
    }, [boardType]);

    return (
        <MokaCard title={`${cardTitle} 게시판 목록`} className="w-100" bodyClassName="d-flex flex-column">
            <Search match={match} />
            <AgGrid match={match} />
        </MokaCard>
    );
};

export default BoardsList;
