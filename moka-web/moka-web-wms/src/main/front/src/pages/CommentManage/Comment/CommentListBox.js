import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import CommentAgGrid from '@pages/CommentManage/CommentAgGrid';
import { columnDefs } from '@pages/CommentManage/CommentAgGrid/CommentAgGridColumns';
import { GET_COMMENT_LIST, changeSearchOption, getCommentList } from '@store/commentManage';
import commonUtil from '@utils/commonUtil';

let clickState = null;

/**
 * 댓글 AgGrid 목록
 */
const CommentListBox = ({ setSelectBannedItem }) => {
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);

    // 목록 더블 클릭시 기존값과 비교할 변수
    // const selectDoubleClickRow = useRef(null);

    // 스토어 연결
    const { search, loading, list, total, COMMENT_STATUS_CODE, COMMENT_MEDIA_CODE } = useSelector(
        (store) => ({
            list: store.comment.comments.list,
            total: store.comment.comments.total,
            search: store.comment.comments.search,
            COMMENT_STATUS_CODE: store.comment.common.COMMENT_STATUS_CODE,
            COMMENT_MEDIA_CODE: store.comment.common.COMMENT_MEDIA_CODE,
            loading: store.loading[GET_COMMENT_LIST],
        }),
        shallowEqual,
    );

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeSearchOption(temp));
            dispatch(getCommentList());
        },
        [dispatch, search],
    );

    /**
     * 더블 클릭하면 최초 렌더링 한 상태로 css 를 업데이트
     */
    // const resetRowHeights = () => {
    //     gridApi.resetRowHeights(); // 리셋. 리셋을 해주 않으면 css 가 꺠지는 현상이 있어서 무조건 한번 리셋.

    //     // 셀도 한번 리셋.
    //     gridApi.refreshCells({
    //         force: true,
    //     });

    //     // 그리드 row 를 기존 css 로 변경 처리.
    //     gridApi.forEachNode(function (rowNode) {
    //         for (var j = 0; j < rowNode.gridOptionsWrapper.columnController.allDisplayedColumns.length; j++) {
    //             if (rowNode.gridOptionsWrapper.columnController.allDisplayedColumns[j].colDef.field === 'cont') {
    //                 rowNode.gridOptionsWrapper.columnController.allDisplayedColumns[j].colDef.cellStyle = {
    //                     boxSizing: 'border-box',
    //                     whiteSpace: 'normal',
    //                     lineHeight: '20px',
    //                     fontSize: '14px',
    //                     height: '50px',
    //                     display: '-webkit-box',
    //                     paddingTop: '5px',
    //                     '-webkit-line-clamp': 2,
    //                     '-webkit-box-orient': 'vertical',
    //                     overflow: 'hidden',
    //                     cursor: 'pointer',
    //                 };
    //             }
    //         }
    //     });

    //     // row 세로고침
    //     gridApi.refreshCells({
    //         force: true,
    //     });
    //     gridApi.resetRowHeights();
    //     gridApi.onRowHeightChanged();
    // };

    /**
     * 한번만 클릭 했을 경우.
     */
    const handleOnCellClicked = (params) => {
        clearTimeout(clickState); // 더블 클릭과 동시에 한번 선택한것으로 간주하기 떄문에 timeout 으로 더블 클릭인지 기다림.
        if (params.colDef.field === 'cont') {
            // 클릭한 cell이 내용이면 URL 이동처리.
            clickState = setTimeout(function () {
                const { commentUrl, contentId } = params.data;
                let url = commentUrl;
                if (url !== null) {
                    window.open(url);
                } else {
                    url = 'https://news.joins.com';
                    if (!commonUtil.isEmpty(contentId)) {
                        url = `${url}/article/${contentId}`;
                    }
                    window.open(url);
                }
            }, 200);
        }
    };

    /**
     * 더블 클릭 처리
     */
    // const handleDoubleClickListRow = (params) => {
    //     clearTimeout(clickState); // onclick 일경우을 대비해서 시간 초기화.
    //     resetRowHeights(); // 리셋.

    //     if (selectDoubleClickRow.current === params.data.cmtSeq) {
    //         selectDoubleClickRow.current = null;
    //         return false;
    //     }

    //     // 현재 선택한 값을 저장하고
    //     // params 에서 선택한 row 의 고유 값을 찾아서 해당 값에 row만 내용의 높이를 늘려주고( 최초 렌더링에서 css 를 빼면 원래 높이로 돌아간다.)
    //     selectDoubleClickRow.current = params.data.cmtSeq;

    //     gridApi.redrawRows();

    //     const focusedCell = params.api.getFocusedCell();

    //     const row = gridApi.getDisplayedRowAtIndex(focusedCell.rowIndex);

    //     focusedCell.column.colDef.cellStyle = {
    //         lineHeight: '22px',
    //     };

    //     gridApi.forEachNode(function (rowNode) {
    //         if (rowNode.data && rowNode.data.cmtSeq === params.data.cmtSeq) {
    //             rowNode.setRowHeight();
    //         }
    //     });
    //     gridApi.refreshCells({
    //         force: true,
    //     });
    //     gridApi.redrawRows({ rowNodes: [row] });
    //     gridApi.onRowHeightChanged();
    // };

    // 그리드가 로딩이 끝나면 그리드 api 를 스테이트에 저장.
    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const onColumnResized = (params) => {
        params.api.resetRowHeights();
    };

    const onColumnVisible = (params) => {
        params.api.resetRowHeights();
    };

    const handleGridRowSelected = (item) => {
        setSelectBannedItem(gridApi.getSelectedRows());
    };

    useEffect(() => {
        // store 에 list 내용이 업데이트 되면 grid 목록을 설정
        setRowData(
            list.map((element) => {
                // 상태 코드
                let statusText = element.status;
                let elementState = COMMENT_STATUS_CODE.filter((e) => e.code === element.status);
                if (elementState.length > 0) {
                    statusText = elementState[0].name;
                }

                // 매체 코드
                let mediaText = '';
                let urlGrpInfo = COMMENT_MEDIA_CODE.filter((e) => Number(e.dtlCd) === element.urlGrp);
                if (urlGrpInfo.length > 0) {
                    mediaText = urlGrpInfo[0].cdNm;
                }

                return {
                    ...element,
                    statusText: statusText,
                    mediaText: mediaText,
                    userInfo: {
                        memNm: element.memNm,
                        memId: element.memId,
                    },
                    action: {
                        cmtSeq: element.cmtSeq,
                        status: element.status,
                        memNm: element.memNm,
                        memId: element.memId,
                    },
                    onClickTitle: (params) => {
                        const { api: gridApi, rowIndex, reactContainer } = params;
                        const row = gridApi.getDisplayedRowAtIndex(rowIndex);
                        const contHeight = reactContainer.querySelector('span').clientHeight;
                        if (row.rowHeight === 54) {
                            row.setRowHeight(contHeight + 10);
                        } else {
                            gridApi.resetRowHeights();
                        }

                        gridApi.onRowHeightChanged();
                    },
                    onPreview: (params) => {
                        const { commentUrl, contentId } = params.data;
                        let url = commentUrl;
                        if (url !== null) {
                            window.open(url);
                        } else {
                            url = 'https://news.joins.com';
                            if (!commonUtil.isEmpty(contentId)) {
                                url = `${url}/article/${contentId}`;
                            }
                            window.open(url);
                        }
                    },
                };
            }),
        );
        // console.log(list);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    return (
        <CommentAgGrid
            loading={loading}
            columnDefs={columnDefs}
            total={total}
            page={search.page}
            size={search.size}
            rowData={rowData}
            getRowNodeId={(params) => params.cmtSeq}
            onRowSelected={(e) => handleGridRowSelected(e)}
            onColumnResized={(e) => onColumnResized(e)}
            onColumnVisible={(e) => onColumnVisible(e)}
            rowHeight={54}
            // rowSelected={(e) => handleClick(e)}
            // onRowClicked={(e) => handleOnClick(e)}
            //onCellClicked={(e) => handleOnCellClicked(e)}
            // onRowDoubleClicked={(e) => handleDoubleClickListRow(e)}
            onGridReady={(e) => onGridReady(e)}
            changeSearchOption={(e) => handleChangeSearchOption(e)}
            preventRowClickCell={['cont', 'action', 'preview']}
        />
    );
};

export default CommentListBox;
