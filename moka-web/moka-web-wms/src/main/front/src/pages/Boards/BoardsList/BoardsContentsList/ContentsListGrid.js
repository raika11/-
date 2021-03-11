import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FileItemRenderer from './FileItemRenderer';
import { GET_LISTMENU_CONTENTS_LIST, changeListmenuSearchOption, clearListmenuContentsInfo, getListmenuContentsList, getListmenuContentsInfo } from '@store/board';

import useBoardDefs from './useBoardDefs';

const ContentsListGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams();
    const boardId = useRef(null);

    // 공통 구분값
    const { pagePathName, search, selectboard, contentsList, total, loading } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
        boardType: store.board.boardType,
        channel_list: store.board.channel_list,
        search: store.board.listmenu.contentsList.search,
        contentsList: store.board.listmenu.contentsList.list,
        total: store.board.listmenu.contentsList.total,
        selectboard: store.board.listmenu.selectboard,
        loading: store.loading[GET_LISTMENU_CONTENTS_LIST],
    }));

    const [columnsState] = useBoardDefs(selectboard, search);

    // 그리드 리스트 state
    const [rowData, setRowData] = useState([]);

    const handleOnRowClicked = ({ selectBoardId, boardSeq, parentBoardSeq }) => {
        if (boardSeq === parentBoardSeq) {
            history.push(`/${pagePathName}/${selectBoardId}/${boardSeq}`);
        } else {
            history.push(`/${pagePathName}/${selectBoardId}/${parentBoardSeq}/reply/${boardSeq}`);
        }
        dispatch(clearListmenuContentsInfo());
        dispatch(getListmenuContentsInfo({ boardId: selectBoardId, boardSeq: boardSeq }));
    };

    // 그리드에서 페이징 등 목록 다시 가지고 올떄.
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeListmenuSearchOption(temp));
            dispatch(getListmenuContentsList({ boardId: boardId.current }));
        },
        [dispatch, search],
    );

    // store 에서 게시글 목록 변경 되었을때 그리드 리스트 업데이트.
    useEffect(() => {
        const setRowDataState = (element) => {
            setRowData([]);
            setRowData(
                element.map((data) => {
                    let replay = data.boardSeq !== data.parentBoardSeq;
                    return {
                        number: !replay ? data.boardSeq : '',
                        title: data.title,
                        selectBoardId: data.boardId,
                        boardSeq: data.boardSeq,
                        selectBoardSeq: data.boardSeq,
                        parentBoardSeq: data.parentBoardSeq,
                        titlePrefixNm1: data.titlePrefixNm1,
                        titlePrefixNm2: data.titlePrefixNm2,
                        titlePrefix1: !replay ? data.titlePrefix1 : '',
                        titlePrefix2: !replay ? data.titlePrefix2 : '',
                        registItem: `${data.regName}(${data.regId})`,
                        regDt: data.modDt && data.modDt.length > 10 ? data.modDt.substr(0, 16) : data.modDt,
                        viewCnt: data.viewCnt,
                        recomInfo: `${data.recomCnt} / ${data.decomCnt}`,
                        recomCnt: data.recomCnt,
                        declareCnt: data.declareCnt,
                        fileItem: {
                            attaches: data.attaches,
                        },
                    };
                }),
            );
        };
        contentsList && setRowDataState(contentsList);
    }, [contentsList]);

    // url 에서 현재 선택한 게시판 id 값 설정.
    useEffect(() => {
        if (!isNaN(params.boardId) && boardId.current !== params.boardId) {
            dispatch(getListmenuContentsList({ boardId: params.boardId }));
            boardId.current = params.boardId;
        }
    }, [dispatch, params]);

    return (
        <>
            {loading === false && columnsState.loading === 'success' && columnsState.columnsDefs && (
                <MokaTable
                    className="overflow-hidden flex-fill"
                    headerHeight={50}
                    columnDefs={columnsState.columnsDefs}
                    rowData={rowData}
                    rowHeight={50}
                    onRowNodeId={(data) => data.boardSeq}
                    onRowClicked={(e) => handleOnRowClicked(e)}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    displayPageNum={DISPLAY_PAGE_NUM}
                    onChangeSearchOption={handleChangeSearchOption}
                    selected={params.boardSeq}
                    frameworkComponents={{ fileItemRenderer: FileItemRenderer }}
                />
            )}
        </>
    );
};

export default ContentsListGrid;
