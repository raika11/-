import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaCardTabs } from '@components';
import ArticleList from '@pages/Article/components/Desking';
import IssueList from '@pages/Issue/components/Desking';
import ReporterList from '@pages/Reporter/components/Desking/ReporterList';
import ColumnistList from '@pages/Columnist/components/Desking/ColumnistList';
import { deskingDragStop } from '@store/desking';
import { messageBox } from '@utils/toastUtil';

/**
 * 페이지편집 > 기사보기 탭
 */
const DeskingArticleTab = (props) => {
    const { componentList, componentAgGridInstances, show } = props;
    const dispatch = useDispatch();
    const { area, selectedComponent, isNaverChannel } = useSelector(({ desking }) => desking);
    const [tabNavs] = useState(['기사', '영상', '패키지', '기자', '칼럼니스트']); // 컴포넌트 폼여부에 따라 리스트 변경o
    const [navIdx, setNavIdx] = useState(0);

    /**
     * 드래그 끝났을 때 액션
     * @param {object} source 드래그 row의 본체? ag-grid instance
     * @param {object} target 드래그 stop되는 타겟 ag-grid의 dragStop 이벤트
     * @param {number} targetIndex agGridInstance 리스트에서 타겟의 순서
     */
    const handleDragStop = useCallback(
        (source, target, targetIndex) => {
            const tgtComponent = componentList[targetIndex];

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
                            messageBox.alert(header.message);
                        } else {
                            source.api.deselectAll();
                        }
                    },
                }),
            );
        },
        [area.areaComp, area.areaComps, componentList, dispatch],
    );

    const createTabs = useCallback(() => {
        return tabNavs.map((nav, idx) => {
            // 기사 조회 컴포넌트
            if (nav === '기사') {
                return (
                    <ArticleList
                        selectedComponent={selectedComponent}
                        dropTargetAgGrid={componentAgGridInstances}
                        onDragStop={handleDragStop}
                        show={navIdx === idx && show}
                        isNaverChannel={isNaverChannel}
                        suppressSearchMyunPan={false}
                    />
                );
            }
            // 영상기사 조회 컴포넌트
            else if (nav === '영상') {
                return (
                    <ArticleList
                        selectedComponent={selectedComponent}
                        dropTargetAgGrid={componentAgGridInstances}
                        dropTargetComponent={componentList}
                        onDragStop={handleDragStop}
                        isNaverChannel={isNaverChannel}
                        show={navIdx === idx && show}
                        movie
                    />
                );
            }
            // 패키지 조회 컴포넌트
            else if (nav === '패키지') {
                return (
                    <IssueList
                        selectedComponent={{}}
                        dropTargetAgGrid={componentAgGridInstances}
                        dropTargetComponent={componentList}
                        onDragStop={handleDragStop}
                        show={navIdx === idx && show}
                    />
                );
            }
            // 기자 조회 컴포넌트
            else if (nav === '기자') {
                return (
                    <ReporterList
                        selectedComponent={{}}
                        dropTargetAgGrid={componentAgGridInstances}
                        dropTargetComponent={componentList}
                        onDragStop={handleDragStop}
                        show={navIdx === idx && show}
                    />
                );
            }
            // 칼럼 리스트 컴포넌트
            else if (nav === '칼럼니스트') {
                return (
                    <ColumnistList
                        selectedComponent={{}}
                        dropTargetAgGrid={componentAgGridInstances}
                        dropTargetComponent={componentList}
                        onDragStop={handleDragStop}
                        show={navIdx === idx && show}
                    />
                );
            }
            return null;
        });
    }, [componentAgGridInstances, componentList, handleDragStop, isNaverChannel, navIdx, selectedComponent, show, tabNavs]);

    return <MokaCardTabs width={840} className="w-100 h-100" onSelectNav={(idx) => setNavIdx(idx)} tabs={createTabs()} tabNavs={tabNavs} />;
};

export default DeskingArticleTab;
