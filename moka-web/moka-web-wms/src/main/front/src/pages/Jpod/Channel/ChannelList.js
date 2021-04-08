import React from 'react';
import ChannelSearchBox from './ChannelSearchBox';
import ChannelListAgGrid from './ChannelListAgGrid';
import { useParams } from 'react-router-dom';

/**
 * J팟 관리 > 채널 > 목록
 */
const ChannelList = ({ match }) => {
    const params = useParams();
    return (
        <>
            <ChannelSearchBox match={match} />
            <ChannelListAgGrid match={match} params={params} />
        </>
    );
};

export default ChannelList;
