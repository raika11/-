import React, { useState } from 'react';
import { MokaCardTabs, MokaIconTabs, MokaIcon } from '@components';
import ArticleList from '@pages/Article/ArticleList';

const DeskingTabs = () => {
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    // 순서 반대로
    return (
        <MokaIconTabs
            onSelectNav={(idx) => setActiveTabIdx(idx)}
            tabWidth={840}
            className="flex-fill"
            tabs={[<MokaCardTabs width={840} fill tabs={[<ArticleList className="px-3 pb-3 pt-2" />]} tabNavs={['기사', '영상', '이슈키워드', '기자', '칼럼 리스트']} />]}
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
