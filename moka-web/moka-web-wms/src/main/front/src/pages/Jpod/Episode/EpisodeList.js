import React from 'react';
import { MokaCard } from '@components';
import EpisodeSearchBox from './EpisodeSearchBox';
import EpisodeListAgGrid from './EpisodeListAgGrid';
import { useParams } from 'react-router-dom';

const EpisodeList = ({ match }) => {
    const params = useParams();
    return (
        <MokaCard width={900} className="mr-gutter" headerClassName="pb-0" title={`에피소드 리스트`} titleClassName="mb-0" bodyClassName="d-flex flex-column">
            <EpisodeSearchBox match={match} />
            <EpisodeListAgGrid match={match} params={params} />
        </MokaCard>
    );
};

export default EpisodeList;
