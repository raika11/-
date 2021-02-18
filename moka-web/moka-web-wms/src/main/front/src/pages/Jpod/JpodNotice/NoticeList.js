import React from 'react';
import { MokaCard } from '@components';
import NoticeListSearchBox from './NoticeListSearchBox';
import NoticeListAgGrid from './NoticeListAgGrid';
// import { useParams } from 'react-router-dom';

const NoticeList = ({ match }) => {
    return (
        <MokaCard width={900} className="mr-gutter" title={`J팟 공지게시판 글목록`} titleClassName="mb-0" bodyClassName="d-flex flex-column">
            <NoticeListSearchBox match={match} />
            <NoticeListAgGrid match={match} />
        </MokaCard>
    );
};

export default NoticeList;
