import React, { useState, useCallback, useEffect } from 'react';
import { MokaLoader, MokaCard, MokaTreeView } from '@components';
import { tree } from '@pages/Boards/BoardConst';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { GET_BOARD_GROUP_LIST, getBoardGroupList } from '@store/boards';
import clsx from 'clsx';

import TreeCategory from './TreeCategory';
import TreeItem from './TreeItem';

const TreeBox = (props) => {
    const dispatch = useDispatch();
    const { pagePathName, groupList, loading } = useSelector((store) => ({
        pagePathName: store.boards.pagePathName,
        groupList: store.boards.listmenu.groupList,
        loading: store.loading[GET_BOARD_GROUP_LIST],
    }));

    const [treeData, setTreeData] = useState([]);
    const [selectCategory, setSelectCategory] = useState(0);

    useEffect(() => {
        dispatch(getBoardGroupList());
    }, [dispatch]);

    useEffect(() => {
        const combineTreeMenu = (element) => {
            setTreeData(
                element.map((data, index) => {
                    const { boardType, boardTypeName } = data;
                    return {
                        listIndex: index,
                        boardType: boardType,
                        boardTypeName: boardTypeName,
                        pageUrl: '/',
                        parentPageSeq: 0,
                        pageOrd: index,
                        btnShow: false,
                        match: 'N',
                        usedYn: 'Y',
                        boardInfoList: data.boardInfoList.map((e, i) => {
                            return {
                                infoIndex: i,
                                boardId: e.boardId,
                                boardName: e.boardName,
                                boardType: e.boardType,
                            };
                        }),
                    };
                }),
            );
        };

        groupList.length > 0 && combineTreeMenu(groupList);
    }, [groupList]);

    return (
        <div className={clsx('border custom-scroll treeview h-100')}>
            <ul className="list-unstyled tree-list">
                {loading ? (
                    <MokaLoader />
                ) : (
                    treeData.map((e, index) => {
                        return (
                            <TreeCategory
                                key={e.listIndex}
                                listIndex={Number(e.listIndex)}
                                selected={selectCategory}
                                onSelected={setSelectCategory}
                                nodeData={{
                                    boardTypeName: e.boardTypeName,
                                    listIndex: e.listIndex,
                                    depth: e.listIndex,
                                }}
                                {...props}
                            >
                                {e.boardInfoList &&
                                    e.boardInfoList.map((nodeData, idx) => {
                                        return <TreeItem key={nodeData.boardId} boardId={nodeData.boardId} nodeId={String(nodeData.listIndex)} nodeData={nodeData} {...props} />;
                                    })}
                            </TreeCategory>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

export default TreeBox;
