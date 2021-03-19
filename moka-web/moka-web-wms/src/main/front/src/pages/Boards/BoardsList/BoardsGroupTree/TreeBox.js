import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GET_BOARD_GROUP_LIST, getBoardGroupList, getListMenuSelectBoard } from '@store/board';
import { MokaLoader } from '@components';
import TreeCategory from './TreeCategory';
import TreeItem from './TreeItem';

/**
 * 게시판 관리 > 게시글 관리(트리)
 */
const TreeBox = (props) => {
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

        // 최초 /router/:boardId 없이 접근시 강제초 첫번쨰 게시판 id 로 라우터 이동 시킴.
        // const goLastBoardIndex = () => {
        //     groupList
        //         .filter((element) => element.boardType === boardType)
        //         .map((e) => {
        //             const infoList = e.boardInfoList;

        //             const { boardId } = infoList[0];
        //             history.push(`/${pagePathName}/${boardId}`);
        //         });
        // };

        // 선택된 boardId 가 있을시에 트리 메뉴를 펼침.
        const setInitData = () => {
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
        };

        // if (isNaN(Number(params.boardId))) {
        //     goLastBoardIndex();
        // } else {
        //     setInitData();
        // }

        setInitData();
    }, [boardType, groupList]);

    useEffect(() => {
        if (boardId) {
            dispatch(getListMenuSelectBoard(boardId));
        }
    }, [dispatch, boardId]);

    return (
        <div className="custom-scroll treeview h-100">
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
        </div>
    );
};

export default TreeBox;
