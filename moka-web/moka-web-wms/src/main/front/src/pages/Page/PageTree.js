import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import { MokaIcon } from '@components';
import { GET_PAGE_TREE, insertSubPage } from '@store/page';
import PageTreeView from './components/PageTreeView';

/**
 * 페이지 Tree 컴포넌트
 */
const PageTree = ({ onDelete, match, findNode }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_PAGE_TREE]);
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const { tree, page, findPage } = useSelector(({ page }) => page);
    const [selected, setSelected] = useState('');
    const [expanded, setExpanded] = useState([]);

    /**
     * 트리 클릭
     * @param {object} item
     */
    const handleClick = (item) => history.push(`${match.path}/${item.pageSeq}`);

    /**
     * 트리 아이템의 추가 버튼(+)
     * @param {object} item
     */
    const handleInsertSub = (item) => {
        const parent = {
            pageSeq: item.pageSeq,
            pageName: item.pageName,
            pageUrl: item.pageUrl,
        };
        dispatch(insertSubPage({ parent, latestDomainId }));
        history.push(`${match.path}/add`);
    };

    useEffect(() => {
        if (tree && page.pageSeq) {
            // pageSeq까지 트리 오픈
            let target = {
                findSeq: page.pageSeq,
                node: null,
                path: [String(tree.pageSeq)],
            };
            let parent = findNode(target, tree);

            if (findPage.length > 0) {
                // 검색결과로 넘어온 페이지seq 리스트가 있으면 그 페이지들도 열어줘야하므로 걔들의 부모 노드를 검색해서 path에 추가함
                findPage.forEach((seq) => {
                    const ps = findNode({ findSeq: seq, node: null, path: [] }, tree);
                    if (ps) {
                        const filtered = ps.path.filter((p) => parent.path.indexOf(p) < 0);
                        if (filtered.length > 0) {
                            parent = {
                                ...parent,
                                path: [...parent.path, ...filtered],
                            };
                        }
                    }
                });
            }
            if (parent) {
                setExpanded(parent.path);
                setSelected(String(page.pageSeq));
            }
        }
    }, [findNode, page.pageSeq, findPage, tree]);

    useEffect(() => {
        if (tree?.pageSeq) {
            if (!page.pageSeq && history.location.pathname.indexOf('/add') < 0) {
                // 첫번째 트리 데이터로 이동
                history.push(`${match.path}/${tree.pageSeq}`);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, match.path, tree]);

    return (
        <PageTreeView
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
