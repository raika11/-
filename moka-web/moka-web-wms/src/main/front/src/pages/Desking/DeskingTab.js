import React, { useState, useRef } from 'react';
import { MokaCardTabs, MokaIconTabs, MokaIcon } from '@components';
import { ArticleDeskList } from '@/pages/Article/components';
import { DeskingHistoryList } from './components';

const DeskingTabs = () => {
    // state
    const [activeTabIdx, setActiveTabIdx] = useState(0);
    const [tabNavs, setTabNav] = useState(['기사', '영상', '이슈키워드', '기자', '칼럼 리스트']); // 컴포넌트 폼여부에 따라 리스트 변경o

    // ref
    const articleRef = useRef(null);
    const mediaRef = useRef(null);

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
                <MokaCardTabs
                    width={840}
                    className="w-100"
                    fill
                    tabs={[
                        // 기사 조회 컴포넌트
                        <ArticleDeskList className="px-3 pb-3 pt-2" ref={articleRef} />,

                        // 영상 기사 조회 컴포넌트
                        <ArticleDeskList className="px-3 pb-3 pt-2" ref={mediaRef} media />,
                    ]}
                    tabNavs={tabNavs}
                />,
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
