import React from 'react';
import { MokaCard } from '@components';
import AgGrid from './MemberChildLoginHistoryAgGrid';
const MemberChildLoginHistoryList = (props) => {
    return (
        <MokaCard className="w-100" titleClassName="h-100 mb-0" bodyClassName="d-flex flex-column" title="로그인 이력">
            <AgGrid />
        </MokaCard>
    );
};

export default MemberChildLoginHistoryList;
