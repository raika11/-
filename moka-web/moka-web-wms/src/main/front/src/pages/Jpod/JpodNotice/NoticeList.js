import React from 'react';
import { MokaCard } from '@components';
import Search from './NoticeListSearch';
import AgGrid from './NoticeListAgGrid';

/**
 * J팟 관리 - 공지 게시판 리스트
 */
const NoticeList = ({ match }) => {
    return (
        <MokaCard className="w-100" title="J팟 공지 게시판 글 목록" bodyClassName="d-flex flex-column">
            {/* 검색 */}
            <Search match={match} />

            {/* AgGrid */}
            <AgGrid match={match} />
        </MokaCard>
    );
};

export default NoticeList;
