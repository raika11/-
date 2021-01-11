import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import { GET_PAGE_TREE, getPage, insertSubPage } from '@store/page/pageAction';
import { MokaTreeView, MokaIcon } from '@components';

/**
 * 페이지 Tree 컴포넌트
 */
const PageTree = ({ onDelete, match }) => {
    const { pageSeq: paramPageSeq } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_PAGE_TREE]);
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const { tree, page } = useSelector((store) => ({
        tree: store.page.tree,
        page: store.page.page,
    }));
    const [selected, setSelected] = useState('');
    const [expanded, setExpanded] = useState([]);

    // 부모노드 찾기(재귀함수)
    // 리턴: {findSeq: page.pageSeq,node: null,path: [String(pageTree.pageSeq)]};
    const findNode = useCallback((findInfo, rootNode) => {
        if (rootNode.pageSeq === findInfo.findSeq) {
            return produce(findInfo, (draft) => draft);
        }

        if (rootNode.nodes && rootNode.nodes.length > 0) {
            for (let i = 0; i < rootNode.nodes.length; i++) {
                const newInfo = produce(findInfo, (draft) => {
                    draft.node = rootNode.nodes[i];
                    draft.path.push(String(rootNode.nodes[i].pageSeq));
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

    useEffect(() => {
        if (tree) {
            if (page.pageSeq) {
                // 최초로딩일때만 트리노드 확장
                // if (expanded.length <= 0) {
                let findInfo = {
                    findSeq: page.pageSeq,
                    node: null,
                    path: [String(tree.pageSeq)],
                };
                let fnode = findNode(findInfo, tree);
                if (fnode) {
                    setExpanded(fnode.path);
                    setSelected(String(page.pageSeq));
                    history.push(`${match.path}/${page.pageSeq}`);
                }
            } else {
                // 추가상태여부
                const bSubInsert = !!(page.parent && page.parent.pageSeq);

                // direct loading여부
                let bDirectLoading = false;
                const pathname = window.location.pathname.match(/^(\/page\/)(\d+)/);
                if (paramPageSeq || (pathname && pathname[2])) {
                    bDirectLoading = true;
                }

                if (!bDirectLoading && !bSubInsert) {
                    setExpanded([]);
                    setSelected('');

                    const option = {
                        pageSeq: tree.pageSeq,
                        // callback: (result) => {
                        //     if (result) history.push(`/page/${pageTree.pageSeq}`);
                        // }
                    };
                    dispatch(getPage(option));
                }
            }
            // if (selected === '' && expanded.length === 0) {
            //     setExpanded([String(tree.pageSeq)]);
            //     setSelected(String(tree.pageSeq));
            // }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tree, page, history, findNode, paramPageSeq, dispatch]);

    /**
     * 트리 클릭. 페이지 수정창 로드
     * @param {object} item
     */
    const handleClick = useCallback(
        (item) => {
            const option = {
                pageSeq: item.pageSeq,
                callback: (result) => {
                    if (result.header.success) {
                        setSelected(String(item.pageSeq));
                        history.push(`${match.path}/${item.pageSeq}`);
                    }
                },
            };
            dispatch(getPage(option));
        },
        [dispatch, history, match.path],
    );

    /**
     * 트리에서 추가버튼 클릭.
     * @param {object} item
     */
    const handleInsertSub = useCallback(
        (item) => {
            const parent = {
                pageSeq: item.pageSeq,
                pageName: item.pageName,
                pageUrl: item.pageUrl,
            };
            setSelected(String(item.pageSeq));
            dispatch(insertSubPage({ parent, latestDomainId }));
            history.push(`${match.path}/add`);
        },
        [dispatch, history, latestDomainId, match.path],
    );

    return (
        <MokaTreeView
            className="h-100"
            data={tree}
            loading={loading}
            expanded={expanded}
            onExpansion={(tree) => {
                setExpanded(
                    produce(expanded, (draft) => {
                        if (expanded.indexOf(String(tree.pageSeq)) > -1) {
                            const idx = expanded.indexOf(String(tree.pageSeq));
                            draft.splice(idx, 1);
                        } else {
                            draft.push(String(tree.pageSeq));
                        }
                    }),
                );
            }}
            selected={selected}
            onSelected={handleClick}
            labelHoverButtons={[
                {
                    icon: <MokaIcon iconName="fal-plus" />,
                    onClick: handleInsertSub,
                    variant: 'searching',
                },
                {
                    icon: <MokaIcon iconName="fal-minus" />,
                    onClick: onDelete,
                    variant: 'searching',
                },
            ]}
        />
    );
};

export default PageTree;
