import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaCardTabs } from '@components';
import { ArticleDeskList } from '@/pages/Article/components';
import ArticleColumnistList from '@/pages/Columnist/components/ArticleColumnistList';
import { deskingDragStop } from '@store/desking';
import toast from '@utils/toastUtil';

const DeskingArticleTab = (props) => {
    const { componentList, componentAgGridInstances, show } = props;
    const dispatch = useDispatch();
    const area = useSelector((store) => store.desking.area);
    const isNaverChannel = useSelector((store) => store.desking.isNaverChannel);

    // state
    const [tabNavs] = useState(['기사', '영상', '이슈키워드', '기자', '칼럼니스트']); // 컴포넌트 폼여부에 따라 리스트 변경o
    const [navIdx, setNavIdx] = useState(0);

    // ref
    const articleRef = useRef(null);
    const mediaRef = useRef(null);
    const columnistRef = useRef(null);

    /**
     * 기사 드래그 끝났을 때 액션
     * @param {object} source 드래그 row의 본체? ag-grid instance
     * @param {object} target 드래그 stop되는 타겟 ag-grid의 dragStop 이벤트
     * @param {number} agGridIndex agGridIndex
     */
    const handleArticleDragStop = (source, target, agGridIndex) => {
        const tgtComponent = componentList[agGridIndex];

        // deskingPart를 찾아야해서 area.areaComp || area.areaComps 에서 찾음
        let areaComp = null;
        if (area.areaComp) areaComp = area.areaComp;
        else if (area.areaComps.length > 0) {
            areaComp = area.areaComps.find((ac) => ac.componentSeq === tgtComponent.componentseq);
        }

        dispatch(
            deskingDragStop({
                source,
                target,
                tgtComponent,
                areaComp: areaComp,
                callback: ({ header }) => {
                    if (!header.success) {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    const createTabs = () => {
        return tabNavs.map((nav, idx) => {
            // 기사 조회 컴포넌트
            if (nav === '기사') {
                return (
                    <ArticleDeskList
                        className="pb-3"
                        ref={articleRef}
                        selectedComponent={{}}
                        dropTargetAgGrid={componentAgGridInstances}
                        onDragStop={handleArticleDragStop}
                        show={navIdx === idx && show}
                        isNaverChannel={isNaverChannel}
                    />
                );
            }
            // 영상기사 조회 컴포넌트
            else if (nav === '영상') {
                return (
                    <ArticleDeskList
                        className="pb-3"
                        ref={mediaRef}
                        selectedComponent={{}}
                        dropTargetAgGrid={componentAgGridInstances}
                        dropTargetComponent={componentList}
                        onDragStop={handleArticleDragStop}
                        show={navIdx === idx && show}
                        isNaverChannel={isNaverChannel}
                        media
                    />
                );
            }
            // 기자 조회 컴포넌트
            // 칼럼 리스트 컴포넌트
            else if (nav === '칼럼니스트') {
                return (
                    <ArticleColumnistList
                        className="pb-3"
                        ref={columnistRef}
                        selectedComponent={{}}
                        dropTargetAgGrid={componentAgGridInstances}
                        dropTargetComponent={componentList}
                        // onDragStop={}
                        show={navIdx === idx && show}
                    />
                );
            }
            return null;
        });
    };

    return <MokaCardTabs width={840} className="w-100" onSelectNav={(idx) => setNavIdx(idx)} tabs={createTabs()} tabNavs={tabNavs} />;
};

export default DeskingArticleTab;
