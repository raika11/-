import React, { useState, useCallback, useEffect } from 'react';
import { MokaLoader, MokaCard, MokaTreeView } from '@components';
// import { tree } from '@pages/Boards/BoardConst';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { GET_BOARD_GROUP_LIST, getBoardGroupList } from '@store/boards';

import TreeCategory from './TreeCategory';
import TreeItem from './TreeItem';

const TreeBox = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();

    const { tree } = useSelector((store) => ({
        tree: store.page.tree,
    }));

    const { pagePathName, groupList, loading } = useSelector((store) => ({
        pagePathName: store.boards.pagePathName,
        groupList: store.boards.listmenu.groupList,
        loading: store.loading[GET_BOARD_GROUP_LIST],
    }));

    const [treeMenu, setTreeMenu] = useState([]);
    const [selected, setSelected] = useState('');
    const [expanded, setExpanded] = useState([]);

    const tempEvent = () => {};

    const handleClick = useCallback((item) => {
        const option = {
            pageSeq: item.pageSeq,
            callback: (result) => {
                if (result.header.success) {
                    setSelected(String(item.pageSeq));
                    // history.push(`/page/${item.pageSeq}`);
                }
            },
        };
        // dispatch(getPage(option));
    }, []);

    useEffect(() => {
        dispatch(getBoardGroupList());
    }, [dispatch]);

    useEffect(() => {
        const combineTreeMenu = (element) => {
            // const temp1 = element.map((data, index) => {
            //     const { boardType, boardTypeName } = data;
            //     return {
            //         pageSeq: index,
            //         pageName: boardTypeName,
            //         pageUrl: '/',
            //         parentPageSeq: 0,
            //         pageOrd: index,
            //         btnShow: false,
            //         match: 'N',
            //         usedYn: 'Y',
            //         nodes: [],
            //     };
            // });

            // const temp2 = JSON.parse(JSON.stringify(temp1));
            // const temp3 = Object.assign({}, { ...temp1 });
            // // console.log(temp3);
            // setTreeMenu(temp3);

            element = JSON.parse(JSON.stringify(element));
            console.log(element);
        };

        groupList.length > 0 && combineTreeMenu(groupList);
    }, [groupList]);

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
        />
    );
};

export default TreeBox;
