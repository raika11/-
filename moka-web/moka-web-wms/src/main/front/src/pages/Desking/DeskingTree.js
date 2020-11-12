import React, { useState, useCallback } from 'react';
import produce from 'immer';

import DeskingTreeView from './components/DeskingTreeView';
import { data } from './area_json';

/**
 * Desking Tree 컴포넌트
 */
const DeskingTree = () => {
    const { body } = data;

    //state
    const [selected, setSelected] = useState('');
    const [expanded, setExpanded] = useState([]);

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

    return (
        <DeskingTreeView
            height={817}
            data={body}
            expanded={expanded}
            onExpansion={(tree) => {
                setExpanded(
                    produce(expanded, (draft) => {
                        if (expanded.indexOf(String(body.areaSeq)) > -1) {
                            const idx = expanded.indexOf(String(body.areaSeq));
                            draft.splice(idx, 1);
                        } else {
                            draft.push(String(body.areaSeq));
                        }
                    }),
                );
            }}
            selected={selected}
            // onSelected={handleClick}
        />
    );
};

export default DeskingTree;
