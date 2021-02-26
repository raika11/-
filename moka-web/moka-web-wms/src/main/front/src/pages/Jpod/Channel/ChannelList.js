import React from 'react';
import { MokaCard } from '@components';
import ChannelSearchBox from './ChannelSearchBox';
import ChannelListAgGrid from './ChannelListAgGrid';
import { useParams } from 'react-router-dom';

const ChannelList = ({ match }) => {
    const params = useParams();
    return (
        <MokaCard width={900} className="mr-gutter" titleClassName="mb-0" bodyClassName="d-flex flex-column" title={`채널 리스트`}>
            <ChannelSearchBox match={match} />
            <ChannelListAgGrid match={match} params={params} />
        </MokaCard>
    );
};

export default ChannelList;
