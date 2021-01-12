import React, { useEffect, Suspense } from 'react';
import { MokaCard } from '@components';
import ChannelSearchBox from './ChannelSearchBox';
import ChannelListAgGrid from './ChannelListAgGrid';

const ChannelList = ({ match }) => {
    return (
        <MokaCard width={900} className="mr-gutter" headerClassName="pb-0" title={`채널 리스트`} titleClassName="mb-0" bodyClassName="d-flex flex-column">
            <ChannelSearchBox match={match} />
            <ChannelListAgGrid match={match} />
        </MokaCard>
    );
};

export default ChannelList;
