import React from 'react';
import { MokaCard } from '@components';
// import ChannelSearchBox from './ChannelSearchBox';
// import ChannelListAgGrid from './ChannelListAgGrid';
// import { useParams } from 'react-router-dom';

const NoticeList = ({ match }) => {
    return <MokaCard width={900} className="mr-gutter" headerClassName="pb-0" title={`J팟 공지게시판 글목록`} titleClassName="mb-0" bodyClassName="d-flex flex-column"></MokaCard>;
};

export default NoticeList;
