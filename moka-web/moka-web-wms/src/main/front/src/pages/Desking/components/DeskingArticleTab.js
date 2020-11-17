import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { MokaCardTabs } from '@components';
import { ArticleDeskList } from '@/pages/Article/components';
import { getRowIndex } from '@utils/agGridUtil';
import { deskingDragStop } from '@store/desking';

const DeskingArticleTab = (props) => {
    const { component, componentAgGridInstances } = props;

    const dispatch = useDispatch();

    // state
    const [tabNavs, setTabNav] = useState(['기사', '영상', '이슈키워드', '기자', '칼럼 리스트']); // 컴포넌트 폼여부에 따라 리스트 변경o

    // ref
    const articleRef = useRef(null);
    const mediaRef = useRef(null);

    const handleArticleDragStop = (api, target) => {
        dispatch(deskingDragStop({ api, target, component }));
    };

    return (
        <MokaCardTabs
            width={840}
            className="w-100"
            fill
            tabs={[
                // 기사 조회 컴포넌트
                <ArticleDeskList className="px-3 pb-3 pt-2" ref={articleRef} dropTargetAgGrid={componentAgGridInstances} onDragStop={handleArticleDragStop} />,

                // 영상 기사 조회 컴포넌트
                <ArticleDeskList className="px-3 pb-3 pt-2" ref={mediaRef} dropTargetAgGrid={componentAgGridInstances} media />,
            ]}
            tabNavs={tabNavs}
        />
    );
};

export default DeskingArticleTab;
