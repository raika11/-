import React, { useState } from 'react';
import { MokaIconTabs, MokaIcon } from '@components';
import { DeskingHistoryList, DeskingArticleTab } from './components';

const DeskingTabs = ({ componentAgGridInstances }) => {
    // state
    const [activeTabIdx, setActiveTabIdx] = useState(0);
    const component = {};

    // 순서 반대로
    return (
        <MokaIconTabs
            foldable={false}
            onSelectNav={(idx) => setActiveTabIdx(idx)}
            tabWidth={840}
            className="flex-fill"
            tabContentClass="flex-fill"
            tabs={[
                /**
                 * 기사보기
                 */
                <DeskingArticleTab componentAgGridInstances={componentAgGridInstances} component={component} />,
                /**
                 * 미리보기
                 */
                <div>미리보기</div>,
                /**
                 * 히스토리
                 */
                <DeskingHistoryList />,
            ]}
            tabNavWidth={48}
            tabNavPosition="right"
            tabNavs={[
                { title: '기사보기', icon: <MokaIcon iconName="fal-file" /> },
                { title: '미리보기', icon: <MokaIcon iconName="fal-tv" /> },
                { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
            ]}
        />
    );
};

export default DeskingTabs;
