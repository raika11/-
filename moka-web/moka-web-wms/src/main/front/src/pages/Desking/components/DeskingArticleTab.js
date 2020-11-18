import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { MokaCardTabs } from '@components';
import { ArticleDeskList } from '@/pages/Article/components';
import { deskingDragStop } from '@store/desking';
import toast from '@utils/toastUtil';

const DeskingArticleTab = (props) => {
    const { componentList, componentAgGridInstances } = props;

    const dispatch = useDispatch();

    // state
    const [tabNavs, setTabNav] = useState(['기사', '영상', '이슈키워드', '기자', '칼럼 리스트']); // 컴포넌트 폼여부에 따라 리스트 변경o
    const [navIdx, setNavIdx] = useState(0);

    // ref
    const articleRef = useRef(null);
    const mediaRef = useRef(null);

    /**
     * 기사 드래그 끝났을 때 액션
     * @param {object} source 드래그 row의 본체? ag-grid instance
     * @param {object} target 드래그 stop되는 타겟 ag-grid의 dragStop 이벤트
     * @param {number} agGridIndex agGridIndex
     */
    const handleArticleDragStop = (source, target, agGridIndex) => {
        const payload = {
            source,
            target,
            tgtComponent: componentList[agGridIndex],
            callback: ({ header }) => {
                if (!header.success) {
                    toast.warn(header.message);
                }
            },
        };
        dispatch(deskingDragStop(payload));
    };

    const createTabs = () => {
        return tabNavs.map((nav, idx) => {
            // 기사 조회 컴포넌트
            if (nav === '기사') {
                return (
                    <ArticleDeskList
                        className="px-3 pb-3 pt-2"
                        ref={articleRef}
                        selectedComponent={{}}
                        dropTargetAgGrid={componentAgGridInstances}
                        onDragStop={handleArticleDragStop}
                        show={navIdx === idx}
                    />
                );
            }
            // 영상기사 조회 컴포넌트
            else if (nav === '영상') {
                return (
                    <ArticleDeskList
                        className="px-3 pb-3 pt-2"
                        ref={mediaRef}
                        selectedComponent={{}}
                        dropTargetAgGrid={componentAgGridInstances}
                        dropTargetComponent={componentList}
                        onDragStop={handleArticleDragStop}
                        show={navIdx === idx}
                        media
                    />
                );
            }
        });
    };

    return <MokaCardTabs width={840} className="w-100" onSelectNav={(idx) => setNavIdx(idx)} fill tabs={createTabs()} tabNavs={tabNavs} />;
};

export default DeskingArticleTab;
