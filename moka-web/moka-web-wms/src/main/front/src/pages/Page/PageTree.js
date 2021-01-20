import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import { MokaIcon } from '@components';
import { GET_PAGE_TREE, getPage, insertSubPage } from '@store/page';
import PageTreeView from './components/PageTreeView';

/**
 * 페이지 Tree 컴포넌트
 */
const PageTree = ({ onDelete, match, findNode }) => {
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

    useEffect(() => {
        if (tree) {
            if (page.pageSeq) {
                // 최초 로딩일때만 트리노드 확장
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
                    dispatch(
                        getPage({
                            page: tree.pageSeq,
                        }),
                    );
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tree, page, history, findNode, paramPageSeq, dispatch]);

    /**
     * 트리 클릭
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
     * 트리 아이템의 추가 버튼(+)
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
