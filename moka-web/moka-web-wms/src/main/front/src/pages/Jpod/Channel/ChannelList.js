import React, { useEffect, Suspense } from 'react';
import { MokaCard } from '@components';
import ChannelSearchBox from './ChannelSearchBox';
import ChannelListAgGrid from './ChannelListAgGrid';
import { useParams, useHistory } from 'react-router-dom';

const ChannelList = ({ match }) => {
    const params = useParams();
    return (
        <MokaCard width={900} className="mr-gutter" headerClassName="pb-0" title={`채널 리스트`} titleClassName="mb-0" bodyClassName="d-flex flex-column">
            <ChannelSearchBox match={match} />
            <ChannelListAgGrid match={match} params={params} />
        </MokaCard>
    );
};

export default ChannelList;
