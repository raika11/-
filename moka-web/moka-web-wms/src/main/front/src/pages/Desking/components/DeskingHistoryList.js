import React from 'react';
import { MokaCard } from '@components';
import Search from './DeskingHistorySearch';
import ComponentWorkAgGrid from './ComponentWorkHistoryAgGrid';
import DeskingWorkAgGrid from './DeskingWorkHistoryAgGrid';

const DeskingHistoryList = () => {
    return (
        <MokaCard title="히스토리" className="w-100" bodyClassName="d-flex">
            <div style={{ width: '456px' }} className="pr-2">
                {/* search의 테이블 */}
                <Search />
                {/*  히스토리 데이터 테이블 */}
                <ComponentWorkAgGrid />
            </div>
            <div className="flex-fill">
                <DeskingWorkAgGrid />
            </div>
        </MokaCard>
    );
};

export default DeskingHistoryList;
