import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';

import { GET_AREA_TREE, getAreaTree, clearTree } from '@store/area/areaAction';
import { getComponentWorkList, changeArea, clearList } from '@store/desking/deskingAction';

import DeskingTreeView from './components/DeskingTreeView';

/**
 * Desking Tree 컴포넌트
 */
const DeskingTree = () => {
    const { areaSeq: paramAreaSeq } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    //state
    const [selected, setSelected] = useState('');
    const [expanded, setExpanded] = useState([]);

    const { tree, area, loading } = useSelector((store) => ({
        tree: store.area.tree,
        area: store.desking.area,
        loading: store.loading[GET_AREA_TREE],
    }));

    useEffect(() => {
        if (!tree) {
            dispatch(getAreaTree({ search: null, callback: null }));
        }
        return () => {
            // unmount
            dispatch(clearTree());
            dispatch(clearList());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 부모노드 찾기(재귀함수)
    // 리턴: {findSeq: page.areaSeq,node: null,path: [String(DeskingTree.areaSeq)]};
    const findNode = useCallback((findInfo, rootNode) => {
        if (rootNode.areaSeq === findInfo.findSeq) {
            return produce(findInfo, (draft) => draft);
        }

        if (rootNode.nodes && rootNode.nodes.length > 0) {
            for (let i = 0; i < rootNode.nodes.length; i++) {
                const newInfo = produce(findInfo, (draft) => {
                    draft.node = rootNode.nodes[i];
                    draft.path.push(String(rootNode.nodes[i].areaSeq));
                });
                const fnode = findNode(newInfo, rootNode.nodes[i]);
                if (fnode !== null && fnode.node !== null) {
                    return fnode;
                }
            }
            return null;
        }
        return null;
    }, []);

    /**
     * 트리 클릭. 편집영역 로드
     * @param {object} item nodeData
     */
    const handleClick = useCallback(
        (item) => {
            const option = {
                areaSeq: item.areaSeq,
                callback: ({ header, body }) => {
                    if (header.success) {
                        setSelected(String(item.areaSeq));
                        history.push(`/desking/${item.areaSeq}`);
                        dispatch(changeArea(body.area));
                    }
                },
            };
            dispatch(getComponentWorkList(option));
        },
        [dispatch, history],
    );

    return (
        <DeskingTreeView
            height={817}
            data={tree}
            loading={loading}
            expanded={expanded}
            onExpansion={(tree) => {
                setExpanded(
                    produce(expanded, (draft) => {
                        if (expanded.indexOf(String(tree.areaSeq)) > -1) {
                            const idx = expanded.indexOf(String(tree.areaSeq));
                            draft.splice(idx, 1);
                        } else {
                            draft.push(String(tree.areaSeq));
                        }
                    }),
                );
            }}
            selected={selected}
            onSelected={handleClick}
        />
    );
};

export default DeskingTree;
