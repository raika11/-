import React from 'react';
import { MokaCard, MokaCardTabs } from '@components';
import ABMainForm from './ABMainForm';

const tabNavs = ['주요 설정', '기타 설정'];

/**
 * A/B 테스트 > 전체 목록 > 탭 > 정보
 */
const ABEdit = () => {
    return (
        <MokaCard title="AB테스트명" headerClassName="pb-0" className="w-100 shadow-none" bodyClassName="p-0 m-0">
            <MokaCardTabs className="w-100 h-100 shadow-none" tabNavs={tabNavs} tabs={[<ABMainForm />]} />
        </MokaCard>
    );
};

export default ABEdit;
