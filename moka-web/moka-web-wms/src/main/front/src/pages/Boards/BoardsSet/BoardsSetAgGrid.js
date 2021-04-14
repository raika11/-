import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { MokaTable } from '@components';
import { BASIC_DATEFORMAT, DISPLAY_PAGE_NUM } from '@/constants';
import { GRID_ROW_HEIGHT } from '@/style_constants';
import { getSetMenuBoardsList, changeSetMenuSearchOption, GET_SET_MENU_BOARD_LIST } from '@store/board';
import { columnDefs } from './BoardsSetAgGridColumns';
import ButtonRenderer from './components/ButtonRenderer';

/**
 * 게시판 관리 > 전체 게시판 AgGrid
 */
const BoardsSetAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { total, list: boardslist, search, boardInfo } = useSelector(({ board }) => board.setMenu);
    const loading = useSelector(({ loading }) => loading[GET_SET_MENU_BOARD_LIST]);
    const [rowData, setRowData] = useState([]);

    /**
     * 목록 클릭
     */
    const handleRowClicked = ({ boardId }) => {
        history.push(`${match.path}/${boardId}`);
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
            dispatch(getSetMenuBoardsList(changeSetMenuSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        if (boardslist) {
            setRowData(
                boardslist.map((data) => ({
                    ...data,
                    regDt: data.regDt ? moment(data.regDt).format(BASIC_DATEFORMAT) : '',
                    modDt: data.modDt ? moment(data.modDt).format(BASIC_DATEFORMAT) : '',
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
            rowHeight={GRID_ROW_HEIGHT.C[0]}
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
            preventRowClickCell={['buttonInfo']}
        />
    );
};

export default BoardsSetAgGrid;
