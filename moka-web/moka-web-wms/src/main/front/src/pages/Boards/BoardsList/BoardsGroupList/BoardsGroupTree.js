import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { GET_BOARD_GROUP_LIST, getBoardGroupList, getListMenuSelectBoard } from '@store/board';
import { MokaLoader } from '@components';
import TreeCategory from './BoardsGroupTreeCategory';
import TreeItem from './BoardsGroupTreeItem';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 목록 트리
 */
const BoardsGroupTree = (props) => {
    const dispatch = useDispatch();
    const { boardId } = useParams();
    const boardType = useSelector((store) => store.board.boardType);
    const groupList = useSelector((store) => store.board.listMenu.groupList);
    const loading = useSelector(({ loading }) => loading[GET_BOARD_GROUP_LIST]);
    const [treeData, setTreeData] = useState([]);
    const [selectCategory, setSelectCategory] = useState(0);

    useEffect(() => {
        dispatch(getBoardGroupList());
    }, [dispatch]);

    useEffect(() => {
        //초기 설정

        // 선택된 boardId 가 있을시에 트리 메뉴를 펼침
        // if (boardId) {
        setTreeData(
            groupList
                .filter((element) => element.boardType === boardType)
                .map((data, index) => {
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
        // }
    }, [boardId, boardType, groupList]);

    useEffect(() => {
        if (boardId) {
            dispatch(getListMenuSelectBoard(boardId));
        }
    }, [dispatch, boardId]);

    return (
        <PerfectScrollbar className="treeview h-100" options={{ handlers: ['drag-thumb', 'keyboard', 'wheel', 'touch'], wheelSpeed: 0.05 }}>
            <ul className="list-unstyled tree-list">
                {loading && <MokaLoader />}
                {treeData.map((e, index) => (
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
                                return (
                                    <TreeItem
                                        key={nodeData.boardId}
                                        selectItem={Number(boardId) === nodeData.boardId}
                                        boardId={nodeData.boardId}
                                        nodeId={String(nodeData.listIndex)}
                                        nodeData={nodeData}
                                        {...props}
                                    />
                                );
                            })}
                    </TreeCategory>
                ))}
            </ul>
        </PerfectScrollbar>
    );
};

export default BoardsGroupTree;
