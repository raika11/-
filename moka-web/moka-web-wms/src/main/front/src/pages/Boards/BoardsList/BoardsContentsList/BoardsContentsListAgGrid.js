import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { MokaTable } from '@components';
import { BASIC_DATEFORMAT, DISPLAY_PAGE_NUM } from '@/constants';
import FileItemRenderer from './FileItemRenderer';
import useBoardDefs from './BoardsContentsListAgGridColumns';
import { GET_LIST_MENU_CONTENTS_LIST, changeListMenuSearchOption, clearListMenuContentsInfo, getListMenuContentsList, getListMenuContentsInfo } from '@store/board';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 글 목록 AgGrid
 */
const BoardsContentsListAgGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { boardId } = useParams();
    const pagePathName = useSelector((store) => store.board.pagePathName);
    const total = useSelector((store) => store.board.listMenu.contentsList.total);
    const search = useSelector((store) => store.board.listMenu.contentsList.search);
    const list = useSelector((store) => store.board.listMenu.contentsList.list);
    const selectBoard = useSelector((store) => store.board.listMenu.selectBoard);
    const loading = useSelector((store) => store.loading[GET_LIST_MENU_CONTENTS_LIST]);

    const [columnsState] = useBoardDefs(selectBoard);
    // rowData
    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 row 클릭
     */
    const handleOnRowClicked = (row) => {
        // 게시글의 답변이 없으면
        if (row.boardSeq === row.parentBoardSeq) {
            history.push(`/${pagePathName}/${row.boardId}/${row.boardSeq}`);
        } else {
            // 게시글의 답변이 있으면
            history.push(`/${pagePathName}/${row.boardId}/${row.parentBoardSeq}/reply/${row.boardSeq}`);
        }
    };

    /**
     * 테이블 검색 옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeListMenuSearchOption(temp));
            dispatch(getListMenuContentsList(boardId));
        },
        [boardId, dispatch, search],
    );

    useEffect(() => {
        // store에서 게시글 목록 변경 되었을 때 그리드 리스트 업데이트
        if (list) {
            setRowData(
                list.map((data) => {
                    let replay = data.boardSeq !== data.parentBoardSeq;
                    return {
                        ...data,
                        number: replay || data.delYn === 'Y' ? '' : data.boardSeq,
                        titlePrefix1: replay ? '' : data.titlePrefix1,
                        titlePrefix2: replay ? '' : data.titlePrefix2,
                        regInfo: `${data.regName}(${data.regId})`,
                        regDt: data.modDt ? moment(data.modDt).format(BASIC_DATEFORMAT) : moment(data.regDt).format(BASIC_DATEFORMAT),
                        recomInfo: `${data.recomCnt} / ${data.decomCnt}`,
                        fileItem: {
                            attaches: data.attaches,
                        },
                    };
                }),
            );
        }
    }, [list]);

    return (
        <>
            {loading === false && columnsState.loading === 'success' && columnsState.columnsDefs && (
                <MokaTable
                    className="overflow-hidden flex-fill"
                    headerHeight={50}
                    rowHeight={50}
                    columnDefs={columnsState.columnsDefs}
                    rowData={rowData}
                    onRowNodeId={(row) => row.boardSeq}
                    onRowClicked={handleOnRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    displayPageNum={DISPLAY_PAGE_NUM}
                    onChangeSearchOption={handleChangeSearchOption}
                    // selected={boardSeq}
                    frameworkComponents={{ fileItemRenderer: FileItemRenderer }}
                />
            )}
        </>
    );
};

export default BoardsContentsListAgGrid;
