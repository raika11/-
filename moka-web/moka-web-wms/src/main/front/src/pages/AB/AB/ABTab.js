import React from 'react';
import { MokaIconTabs, MokaIcon } from '@components';
import ABEdit from './ABEdit';
import ABInstanceList from './ABInstanceList';

/**
 * A/B 테스트 > 전체 목록 > 탭
 */
const ABTab = (props) => {
    return (
        <MokaIconTabs
            foldable={false}
            className="flex-fill h-100"
            tabNavs={[
                { title: '정보', text: 'Info' },
                { title: '인스턴스 목록', icon: <MokaIcon iconName="fal-history" /> },
            ]}
            tabs={[<ABEdit {...props} />, <ABInstanceList {...props} />]}
        />
    );
};

export default ABTab;
