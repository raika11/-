import React from 'react';
import { MokaCard } from '@components';
import Search from './DeskingHistorySearch';

const DeskingHistoryList = () => {
    return (
        <MokaCard title="히스토리" className="w-100">
            <div className="d-flex">
                <Search />
                {/* search의 테이블 */}
            </div>
            {/*  히스토리 데이터 테이블 */}
        </MokaCard>
    );
};

export default DeskingHistoryList;
