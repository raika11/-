import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import { toastr } from 'react-redux-toastr';

import { GET_PAGE_TREE, getPageTree, changeSearchOption, getPage } from '@store/page/pageAction';

import { MokaTreeView, MokaIcon } from '@components';

/**
 * 페이지 Tree 컴포넌트
 */
const PageTree = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    //state
    const [selected, setSelected] = useState('');
    const [expanded, setExpanded] = useState([]);

    const { tree, search, loading, page } = useSelector((store) => ({
        tree: store.page.tree,
        search: store.page.search,
        loading: store.loading[GET_PAGE_TREE],
        page: store.page.page,
    }));

    useEffect(() => {
        if (tree) {
            if (selected === '' && expanded.length == 0) {
                setExpanded([String(tree.pageSeq)]);
                setSelected(String(tree.pageSeq));
            }
        }
    }, [tree]);

    const handleClick = useCallback((tree) => {
        const option = {
            pageSeq: tree.pageSeq,
            callback: (result) => {
                history.push(`/page/${tree.pageSeq}`);
            }
        };
        setSelected(String(tree.pageSeq));
        dispatch(getPage(option));
    });

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
                    onClick: (tree) => {
                        toastr.warning('+ 아이콘 클릭', tree.pageName);
                    },
                    variant: 'warning',
                },
                {
                    icon: <MokaIcon iconName="fal-minus" />,
                    onClick: (tree) => {
                        toastr.success('- 아이콘 클릭', tree.pageName);
                    },
                    variant: 'warning',
                },
            ]}
        />
    );
};

export default PageTree;
