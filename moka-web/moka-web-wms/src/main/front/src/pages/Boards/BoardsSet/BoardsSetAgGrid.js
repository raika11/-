import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { MokaTable } from '@components';
import { BASIC_DATEFORMAT, DISPLAY_PAGE_NUM } from '@/constants';
import { changeSetMenuSearchOption, GET_SET_MENU_BOARD_LIST } from '@store/board';

import { columnDefs } from './BoardsSetAgGridColumns';
import ButtonRenderer from './components/ButtonRenderer';

/**
 * 게시판 관리 > 전체 게시판 AgGrid
 */
const BoardsSetAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const pagePathName = useSelector((store) => store.board.pagePathName);
    const total = useSelector((store) => store.board.setMenu.total);
    const boardslist = useSelector((store) => store.board.setMenu.list);
    const search = useSelector((store) => store.board.setMenu.search);
    const boardInfo = useSelector((store) => store.board.setMenu.boardInfo);
    const loading = useSelector((store) => store.loading[GET_SET_MENU_BOARD_LIST]);

    // 그리드 리스트 데이터
    const [rowData, setRowData] = useState([]);

    // 리스트 아이템 클릭
    const handleRowClicked = ({ boardId }) => {
        history.push(`/${pagePathName}/${boardId}`);
    };

    /**
     * 검색 조건 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeSetMenuSearchOption(temp));
        },
        [dispatch, search],
    );

    useEffect(() => {
        if (boardslist) {
            setRowData(
                boardslist.map((data) => ({
                    ...data,
                    regDt: moment(data.regDt || '').format(BASIC_DATEFORMAT),
                    modDt: moment(data.modDt || '').format(BASIC_DATEFORMAT),
                    buttonInfo: {
                        boardId: data.boardId,
                        boardUrl: data.boardUrl,
                    },
                })),
            );
        }
    }, [boardslist]);

    return (
        <MokaTable
            className="flex-fill overflow-hidden"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(data) => data.boardId}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            displayPageNum={DISPLAY_PAGE_NUM}
            onChangeSearchOption={handleChangeSearchOption}
            selected={boardInfo.boardId}
            frameworkComponents={{
                buttonRenderer: ButtonRenderer,
            }}
            preventRowClickCell={['button']}
        />
    );
};

export default BoardsSetAgGrid;
