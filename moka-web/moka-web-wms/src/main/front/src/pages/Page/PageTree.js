import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import { toastr } from 'react-redux-toastr';

import { GET_PAGE_TREE, getPage, insertSubPage } from '@store/page/pageAction';

import { MokaTreeView, MokaIcon } from '@components';

/**
 * 페이지 Tree 컴포넌트
 */
const PageTree = ({ onDelete }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    //state
    const [selected, setSelected] = useState('');
    const [expanded, setExpanded] = useState([]);

    const { tree, search, loading, latestDomainId, page } = useSelector((store) => ({
        tree: store.page.tree,
        search: store.page.search,
        loading: store.loading[GET_PAGE_TREE],
        latestDomainId: store.auth.latestDomainId,
        page: store.page.page,
    }));

    useEffect(() => {
        if (tree) {
            if (selected === '' && expanded.length === 0) {
                setExpanded([String(tree.pageSeq)]);
                setSelected(String(tree.pageSeq));
            }
        }
    }, [expanded.length, selected, tree]);

    /**
     * 트리 클릭. 페이지 수정창 로드
     * @param {*} item
     */
    const handleClick = useCallback(
        (item) => {
            const option = {
                pageSeq: item.pageSeq,
                callback: (result) => {
                    if (result.header.success) {
                        setSelected(String(item.pageSeq));
                        history.push(`/page/${item.pageSeq}`);
                    }
                },
            };
            dispatch(getPage(option));
        },
        [dispatch, history],
    );

    /**
     * 트리에서 추가버튼 클릭.
     * @param {*} item
     */
    const handleInsertSub = (item) => {
        const parent = {
            pageSeq: item.pageSeq,
            pageName: item.pageName,
            pageUrl: item.pageUrl,
        };
        setSelected([String(item.pageSeq)]);
        dispatch(insertSubPage({ parent, latestDomainId }));
        history.push('/page');
    };

    return (
        <MokaTreeView
            height={638}
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
                    variant: 'warning',
                },
                {
                    icon: <MokaIcon iconName="fal-minus" />,
                    onClick: onDelete,
                    variant: 'warning',
                },
            ]}
        />
    );
};

export default PageTree;
