import React from 'react';
import { MokaIconTabs, MokaIcon } from '@components';

/**
 * A/B 테스트 > 전체 목록 > 탭
 */
const ABTab = () => {
    return (
        <MokaIconTabs
            foldable={false}
            className="flex-fill h-100"
            tabNavs={[
                { title: '정보', text: 'Info' },
                { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
            ]}
        />
    );
};

export default ABTab;
