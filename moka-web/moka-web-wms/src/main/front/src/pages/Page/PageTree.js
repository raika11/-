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
    const { tree, page } = useSelector(({ page }) => page);
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
            let findInfo = {
                findSeq: page.pageSeq,
                node: null,
                path: [String(tree.pageSeq)],
            };
            let fnode = findNode(findInfo, tree);
            if (fnode) {
                setExpanded(fnode.path);
                setSelected(String(page.pageSeq));
            }
        }
    }, [findNode, page.pageSeq, tree]);

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
