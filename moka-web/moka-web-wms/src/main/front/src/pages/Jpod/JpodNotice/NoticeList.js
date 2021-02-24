import React from 'react';
import { MokaCard } from '@components';
import NoticeListSearchBox from './NoticeListSearchBox';
import NoticeListAgGrid from './NoticeListAgGrid';

/**
 * J팟 관리 - 공지 게시판 리스트
 */
const NoticeList = ({ match }) => {
    return (
        <MokaCard width={798} className="mr-gutter" title={`J팟 공지 게시판 글목록`} titleClassName="mb-0" bodyClassName="d-flex flex-column">
            {/* 검색 */}
            <NoticeListSearchBox match={match} />

            {/* AgGrid */}
            <NoticeListAgGrid match={match} />
        </MokaCard>
    );
};

export default NoticeList;
