import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { MokaTable } from '@components';
import { BASIC_DATEFORMAT, DISPLAY_PAGE_NUM } from '@/constants';
import FileItemRenderer from './FileItemRenderer';
import { boardColumnDefs } from './BoardsContentsListAgGridColumns';
import { GET_LIST_MENU_CONTENTS_LIST, changeListMenuSearchOption, getListMenuContentsList } from '@store/board';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 글 목록 AgGrid
 */
const BoardsContentsListAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { boardId } = useParams();
    const total = useSelector((store) => store.board.listMenu.contentsList.total);
    const search = useSelector((store) => store.board.listMenu.contentsList.search);
    const list = useSelector((store) => store.board.listMenu.contentsList.list);
    const selectBoard = useSelector((store) => store.board.listMenu.selectBoard);
    const contentsInfo = useSelector((store) => store.board.listMenu.contents.info);
    const contentsReply = useSelector((store) => store.board.listMenu.contents.reply);
    const loading = useSelector((store) => store.loading[GET_LIST_MENU_CONTENTS_LIST]);

    // const [columnData, setColumnData] = useState(columnDefs);
    // const [gridApi, setGridApi] = useState(null);
    // const [gridColumnApi, setGridColumnApi] = useState(null);

    // rowData
    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 row 클릭
     */
    const handleRowClicked = (row) => {
        // 게시글의 답변이 없으면
        if (row.boardSeq === row.parentBoardSeq) {
            history.push(`${match.path}/${row.boardId}/${row.boardSeq}`);
        } else {
            // 게시글의 답변이 있으면
            history.push(`${match.path}/${row.boardId}/${row.parentBoardSeq}/reply/${row.boardSeq}`);
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
        // 게시글 목록
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
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            headerHeight={50}
            rowHeight={50}
            columnDefs={boardColumnDefs(selectBoard)}
            rowData={rowData}
            onRowNodeId={(row) => row.boardSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            displayPageNum={DISPLAY_PAGE_NUM}
            onChangeSearchOption={handleChangeSearchOption}
            selected={contentsInfo.boardSeq || contentsReply.boardSeq}
            frameworkComponents={{ fileItemRenderer: FileItemRenderer }}
            applyColumnDefOrder
        />
    );
};

export default BoardsContentsListAgGrid;
