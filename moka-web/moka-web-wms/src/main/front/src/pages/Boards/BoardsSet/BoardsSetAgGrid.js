import React, { useEffect, useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { changeSetMenuSearchOption, GET_SETMENU_BOARD_LIST } from '@store/board';

import { columnDefs } from './BoardsSetAgGridColumns';
import ButtonRenderer from './components/ButtonRenderer';

/**
 * 게시판 관리 > 전체 게시판 AgGrid
 */
const BoardsSetAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();

    const { boardslist, total, page, size, search, loading, pagePathName } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
        total: store.board.setmenu.total,
        search: store.board.setmenu.search,
        boardslist: store.board.setmenu.list,
        loading: store.loading[GET_SETMENU_BOARD_LIST],
    }));

    // 그리드 리스트 데이터.
    const [rowData, setRowData] = useState([]);

    // 리스트 아이템 클릭.
    const handleRowClicked = ({ boardId }) => {
        history.push(`/${pagePathName}/${boardId}`);
    };

    // grid 에서 상태 변경시 리스트를 가지고 오기.
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
        const setRowDataState = (element) => {
            setRowData([]);
            setRowData(
                element.map((data) => {
                    const regDt = (data.regDt || '').slice(0, -3);
                    const modDt = (data.modDt || '').slice(0, -3);

                    return {
                        boardId: data.boardId,
                        boardName: data.boardName,
                        regDt: regDt,
                        modDt: modDt,
                        usedYn: data.usedYn,
                        buttonInfo: {
                            boardId: data.boardId,
                            boardUrl: data.boardUrl,
                        },
                    };
                }),
            );
        };
        setRowDataState(boardslist);
    }, [boardslist]);

    return (
        <>
            <MokaTable
                className="flex-fill overflow-hidden"
                columnDefs={columnDefs}
                rowData={rowData}
                // rowHeight={40}
                onRowNodeId={(data) => data.boardId}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={page}
                size={size}
                displayPageNum={DISPLAY_PAGE_NUM}
                onChangeSearchOption={handleChangeSearchOption}
                selected={params.boardId}
                frameworkComponents={{
                    buttonRenderer: ButtonRenderer,
                }}
                preventRowClickCell={['button']}
            />
        </>
    );
};

export default BoardsSetAgGrid;
