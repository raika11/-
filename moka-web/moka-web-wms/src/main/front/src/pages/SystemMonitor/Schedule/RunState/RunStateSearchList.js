import React from 'react';
import { MokaCard } from '@/components';
import Search from './RunStateSearch';
import AgGrid from './RunStateSearchAgGrid';

/**
 * 스케줄 서버 관리 > 작업 실행상태 목록
 */
const RunStateSearchList = ({ show, match }) => {
    return (
        <MokaCard title="작업 실행상태 목록" className="flex-fill" bodyClassName="d-flex flex-column">
            <Search show={show} />
            <AgGrid match={match} />
        </MokaCard>
    );
};

export default RunStateSearchList;
