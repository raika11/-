import React from 'react';
import { useParams } from 'react-router-dom';
import { MokaCard } from '@components';
import EpisodeSearchBox from './EpisodeSearchBox';
import EpisodeListAgGrid from './EpisodeListAgGrid';

/**
 * J팟 관리 - 에피소드 리스트
 */
const EpisodeList = ({ match }) => {
    const params = useParams();
    return (
        <MokaCard width={898} className="mr-gutter" title={`에피소드 리스트`}>
            <EpisodeSearchBox match={match} />
            <EpisodeListAgGrid match={match} params={params} />
        </MokaCard>
    );
};

export default EpisodeList;
