import React from 'react';
import ArticleList from '@pages/Article/components/Desking/ArticleList';
import { MokaCard } from '@components';
import { getRowIndex } from '@utils/agGridUtil';
import { useSelector, useDispatch } from 'react-redux';
import { changeHotClickList } from '@store/bulks';
import toast from '@/utils/toastUtil';

const BulkhArticleList = ({ componentAgGridInstances }) => {
    const dispatch = useDispatch();
    const { hotClickList } = useSelector((store) => ({
        hotClickList: store.bulks.bulkh.hotclickList.list,
    }));

    // 임시 스테이트에 기사 추가및 순서 변경 처리.
    const addItems = (items, targetIndex) => {
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
    };

    // 기사를 드래그 했을때 처리..
    const handleArticleDragStop = (source, target) => {
        let items = [];

        let overIndex = 0,
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

        // 드래스 선택 기사 여러게 일때.
        if (Array.isArray(sourceNode)) {
            items = Object.values(sourceNode)
                .map((element) => element.data)
                .filter(function (e) {
                    if (Object.keys(hotClickList).find((key) => hotClickList[key].totalId === e.totalId)) {
                        toast.error('(임시 문구)이미 등록되어 있는 기사 입니다.');
                        return null;
                    } else {
                        return e;
                    }
                });
            // 드래그 기사 하나 일때.
        } else if (typeof sourceNode === 'object') {
            if (Object.keys(hotClickList).find((key) => hotClickList[key].totalId === sourceNode.data.totalId)) {
                toast.error('이미 등록되어 있는 기사 입니다.');
                return null;
            }
            items = [sourceNode.data];
        }

        addItems(items, overIndex);
    };

    return (
        <MokaCard titleClassName="mb-0" width={850} loading={null} header={false} className={'custom-scroll mr-gutter flex-fill'}>
            <ArticleList className="flex-fill" selectedComponent={{}} dropTargetAgGrid={componentAgGridInstances} onDragStop={handleArticleDragStop} />
        </MokaCard>
    );
};

export default BulkhArticleList;
