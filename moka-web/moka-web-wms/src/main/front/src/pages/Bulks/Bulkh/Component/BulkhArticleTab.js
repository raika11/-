import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaCardTabs } from '@components';
import { changeHotClickList } from '@store/bulks';
import { ArticleList, ArticleMediaList } from '@pages/Article/components/Desking';
import ReporterList from '@pages/Reporter/components/Desking/ReporterList';
import ColumnistList from '@pages/Columnist/components/Desking/ColumnistList';
import { messageBox } from '@utils/toastUtil';
import { getRowIndex } from '@utils/agGridUtil';

/**
 * 아티클 핫클릭 > 기사탭
 */
const BulkhArticleTab = (props) => {
    const { componentAgGridInstances } = props;
    const dispatch = useDispatch();
    const [tabNavs] = useState(['기사', '영상', '이슈키워드', '기자', '칼럼니스트']);
    const [navIdx, setNavIdx] = useState(0);

    const { hotClickList } = useSelector((store) => ({
        hotClickList: store.bulks.bulkh.hotclickList.list,
    }));

    /**
     * 임시 스테이트에 기사 추가및 순서 변경 처리
     */
    const addItems = useCallback(
        (items, targetIndex) => {
            let arrayItem = hotClickList.map((e) => e);
            let newItem = items.map((element) => {
                return {
                    totalId: element.totalId,
                    title: element.artTitle,
                    url: `https://news.joins.com/article/${element.totalId}`,
                };
            });
            arrayItem.splice(targetIndex + 1, 0, ...newItem);
            dispatch(changeHotClickList(arrayItem));
        },
        [dispatch, hotClickList],
    );

    /**
     * 기사 드래그 끝났을 때 액션
     * @param {object} source 드래그 row의 본체? ag-grid instance
     * @param {object} target 드래그 stop되는 타겟 ag-grid의 dragStop 이벤트
     */
    const handleArticleDragStop = useCallback(
        (source, target) => {
            let items = [],
                overIndex = 0,
                sourceNode = null;

            if (target.overIndex) {
                overIndex = target.overIndex;
            } else if (source.event) {
                overIndex = getRowIndex(source.event);
            }

            sourceNode = source.api.getSelectedNodes().length > 0 ? source.api.getSelectedNodes() : source.node;
            if (Array.isArray(sourceNode)) {
                // sourceNode 정렬 (childIndex 순으로)
                sourceNode = sourceNode.sort(function (a, b) {
                    return a.childIndex - b.childIndex;
                });
            }

            // 등록 기사 카운트.
            if (hotClickList.length >= 11) {
                messageBox.alert('기사는 11개까지 등록 가능합니다.');
                return null;
            }

            // 기사 여러개 이동
            if (Array.isArray(sourceNode)) {
                items = Object.values(sourceNode)
                    .map((element) => element.data)
                    .filter(function (e) {
                        if (Object.keys(hotClickList).find((key) => hotClickList[key].totalId === e.totalId)) {
                            messageBox.alert('(임시 문구)이미 등록되어 있는 기사 입니다.');
                            return null;
                        } else {
                            return e;
                        }
                    });
            }
            // 기사 1개만 이동
            else if (typeof sourceNode === 'object') {
                if (Object.keys(hotClickList).find((key) => hotClickList[key].totalId === sourceNode.data.totalId)) {
                    messageBox.alert('이미 등록되어 있는 기사 입니다.');
                    return null;
                }
                items = [sourceNode.data];
            }

            addItems(items, overIndex);
        },
        [addItems, hotClickList],
    );

    /**
     * 탭 생성
     */
    const createTabs = useCallback(() => {
        return tabNavs.map((nav, idx) => {
            // 기사 조회 컴포넌트
            if (nav === '기사') {
                return <ArticleList dropTargetAgGrid={componentAgGridInstances} onDragStop={handleArticleDragStop} show={navIdx === idx} />;
            }
            // 영상기사 조회 컴포넌트
            else if (nav === '영상') {
                return (
                    <ArticleMediaList
                        dropTargetAgGrid={componentAgGridInstances}
                        // dropTargetComponent={componentList}
                        onDragStop={handleArticleDragStop}
                        show={navIdx === idx}
                    />
                );
            }
            // 기자 조회 컴포넌트
            else if (nav === '기자') {
                return (
                    <ReporterList
                        selectedComponent={{}}
                        dropTargetAgGrid={componentAgGridInstances}
                        // dropTargetComponent={componentList}
                        // onDragStop={}
                        show={navIdx === idx}
                    />
                );
            }
            // 칼럼 리스트 컴포넌트
            else if (nav === '칼럼니스트') {
                return (
                    <ColumnistList
                        selectedComponent={{}}
                        dropTargetAgGrid={componentAgGridInstances}
                        // dropTargetComponent={componentList}
                        // onDragStop={}
                        show={navIdx === idx}
                    />
                );
            }
            return null;
        });
    }, [componentAgGridInstances, handleArticleDragStop, navIdx, tabNavs]);

    return <MokaCardTabs width={850} className="flex-fill h-100" onSelectNav={(idx) => setNavIdx(idx)} tabs={createTabs()} tabNavs={tabNavs} />;
};

export default BulkhArticleTab;
