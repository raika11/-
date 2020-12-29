import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ColumnDefs, tempRows } from './BoardsSetGridColumns';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { useDispatch, useSelector } from 'react-redux';
import { changeSetMenuSearchOption, GET_SETMENU_BOARD_LIST, getBoardInfo } from '@store/boards';
import { useHistory, useParams } from 'react-router-dom';
import { selectItem } from '@pages/Boards/BoardConst';

const BulkhHotClicAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();

    const { boardslist, total, page, size, search, loading, pagePathName } = useSelector((store) => ({
        pagePathName: store.boards.pagePathName,
        total: store.boards.setmenu.total,
        search: store.boards.setmenu.search,
        boardslist: store.boards.setmenu.list,
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
            setRowData(
                element.map((data) => {
                    const { boardType } = selectItem;
                    const regDt = data.regDt && data.regDt.length > 10 ? data.regDt.substr(0, 10) : data.regDt;
                    const boardTypeName = boardType.find((element) => {
                        return element.value === data.boardType;
                    });

                    return {
                        llowFileCnt: data.llowFileCnt,
                        allowFileExt: data.allowFileExt,
                        allowFileSize: data.allowFileSize,
                        answLevel: data.answLevel,
                        answYn: data.answYn,
                        boardDesc: data.boardDesc,
                        boardId: data.boardId,
                        boardName: data.boardName,
                        boardType: data.boardType,
                        boardTypeName: boardTypeName.name,
                        captchaYn: data.captchaYn,
                        channelType: data.channelType,
                        declareYn: data.declareYn,
                        editorYn: data.editorYn,
                        fileYn: data.fileYn,
                        insLevel: data.insLevel,
                        recomFlag: data.recomFlag,
                        replyLevel: data.replyLevel,
                        replyYn: data.replyYn,
                        titlePrefix1: data.titlePrefix1,
                        titlePrefix2: data.titlePrefix2,
                        usedYn: data.usedYn,
                        viewLevel: data.viewLevel,
                        regDt: regDt,
                    };
                }),
            );
        };
        setRowDataState(boardslist);
    }, [boardslist]);

    return (
        <>
            <MokaTable
                className="overflow-hidden flex-fill"
                // agGridHeight={650}
                columnDefs={ColumnDefs}
                rowData={rowData}
                // rowHeight={40}
                onRowNodeId={(data) => data.boardId}
                onRowClicked={(e) => handleRowClicked(e)}
                loading={loading}
                total={total}
                page={page}
                size={size}
                displayPageNum={DISPLAY_PAGE_NUM}
                onChangeSearchOption={handleChangeSearchOption}
                selected={params.boardId}
            />
        </>
    );
};

export default BulkhHotClicAgGrid;
