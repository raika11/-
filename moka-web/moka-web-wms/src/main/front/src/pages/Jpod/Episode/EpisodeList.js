import React from 'react';
import { MokaCard } from '@components';
import EpisodeSearchBox from './EpisodeSearchBox';
import EpisodeListAgGrid from './EpisodeListAgGrid';

/**
 * J팟 관리 - 에피소드 리스트
 */
const EpisodeList = ({ match }) => {
    return (
        <MokaCard className="w-100" bodyClassName="d-flex flex-column" title={`에피소드 리스트`}>
            <EpisodeSearchBox match={match} />
            <EpisodeListAgGrid match={match} />
        </MokaCard>
    );
};

export default EpisodeList;
