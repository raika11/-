import React from 'react';

import { MokaCardTabs } from '@components';
import { ArticleList } from './components';

const DeskingTabs = () => {
    return <MokaCardTabs width={840} fill tabs={[<ArticleList />]} tabNavs={['기사', '영상', '이슈키워드', '기자', '칼럼 리스트']} />;
};

export default DeskingTabs;
