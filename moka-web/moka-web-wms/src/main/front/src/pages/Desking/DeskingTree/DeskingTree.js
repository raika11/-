import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import { AREA_HOME } from '@/constants';
import { GET_AREA_TREE, getAreaTree, clearTree } from '@store/area/areaAction';
import { getComponentWorkList, changeArea, clearList } from '@store/desking/deskingAction';
import { messageBox } from '@utils/toastUtil';
import DeskingTreeView from './DeskingTreeView';

/**
 * 페이지편집 > 좌측 트리
 */
const DeskingTree = ({ setComponentAgGridInstances, match }) => {
    const { areaSeq } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_AREA_TREE]);
    const { tree, treeBySeq } = useSelector(({ area }) => area);
    const [selected, setSelected] = useState('');
    const [expanded, setExpanded] = useState([]);

    /**
     * 트리아이템의 path찾기
     * @params {number} targetSeq areaSeq
     * @returns {array} ['13', '3']
     */
    const findPath = useCallback(
        (targetSeq) => {
            let paths = [];

            const loop = (targetSeq, paths) => {
                const target = treeBySeq[targetSeq];
                if (target.parentAreaSeq) {
                    paths.push(String(target.parentAreaSeq));
                    loop(target.parentAreaSeq, paths);
                } else {
                    if (paths.indexOf(String(target.areaSeq)) < 0) {
                        paths.push(String(target.areaSeq));
                    }
                }
            };

            loop(targetSeq, paths);
            return paths;
        },
        [treeBySeq],
    );

    /**
     * 트리 아이템 (컴포넌트 워크 데이터) 조회
     */
    const loadWork = useCallback(
        (areaSeq) => {
            /**
             * componentAgGridInstaces를 초기화한다.
             * 트리 클릭 => (초기화) => 컴포넌트워크 데이터 조회 => 컴포넌트 agGrid인스턴스 추가
             * (DeskingWorkAgGrid.js에서 agGrid인스턴스를 추가하고 있음)
             */
            setComponentAgGridInstances([]);
            dispatch(
                getComponentWorkList({
                    areaSeq: areaSeq,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            dispatch(changeArea(body.area));
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch, setComponentAgGridInstances],
    );

    /**
     * 트리 확장
     */
    const handleExpansion = useCallback(
        ({ areaSeq }) => {
            setExpanded(
                produce(expanded, (draft) => {
                    const idx = expanded.indexOf(String(areaSeq));
                    idx > -1 ? draft.splice(idx, 1) : draft.push(String(areaSeq));
                }),
            );
        },
        [expanded],
    );

    /**
     * 트리 클릭
     * @param {object} item nodeData
     */
    const handleSelectNode = useCallback(
        (item) => {
            if (item?.parentAreaSeq) {
                // 부모 노드가 아니면 링크 이동 or 데이터 새로 로드
                if (String(item.areaSeq) === areaSeq) {
                    // path와 동일한 키이면 데이터 새로 로드
                    loadWork(item.areaSeq);
                } else {
                    history.push(`${match.path}/${item.areaSeq}`);
                }
            } else {
                // 부모노드면!! 트리 확장
                handleExpansion({ areaSeq: item.areaSeq });
            }
        },
        [history, loadWork, areaSeq, match, handleExpansion],
    );

    useEffect(() => {
        if (tree && areaSeq) {
            // areaSeq까지 트리 오픈
            let paths = findPath(areaSeq);
            loadWork(areaSeq);
            setExpanded(paths);
            setSelected(String(areaSeq));
        }
    }, [dispatch, areaSeq, findPath, tree, loadWork]);

    useEffect(() => {
        dispatch(
            getAreaTree({
                search: {
                    sourceCode: AREA_HOME[0].value,
                },
                callback: null,
            }),
        );
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearTree());
            dispatch(clearList());
        };
    }, [dispatch]);

    return <DeskingTreeView height={817} data={tree} loading={loading} expanded={expanded} onExpansion={handleExpansion} selected={selected} onSelected={handleSelectNode} />;
};

export default DeskingTree;
