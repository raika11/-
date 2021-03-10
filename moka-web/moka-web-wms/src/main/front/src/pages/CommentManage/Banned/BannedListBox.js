import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import CommentAgGrid from '@pages/CommentManage/CommentAgGrid';
import { GET_COMMENTS_BLOCKS } from '@store/commentManage';
import { BannedColumnDefs } from '@pages/CommentManage/CommentAgGrid/CommentAgGridColumns';
import { changeBannedsSearchOption, getCommentsBlocks } from '@store/commentManage';

/**
 * 댓글 관리 > 차단 목록 AgGrid
 */
const BannedListBox = () => {
    const dispatch = useDispatch();
    const [gridApi, setGridApi] = useState(null);
    // const selectDoubleClickRow = useRef(null);
    const [rowData, setRowData] = useState([]);

    // 스토어 연결.
    const { pageGubun, list, total, search, loading } = useSelector(
        (store) => ({
            pageGubun: store.comment.banneds.pageGubun,
            list: store.comment.banneds.commentsBlocks.list,
            total: store.comment.banneds.commentsBlocks.total,
            search: store.comment.banneds.commentsBlocks.search,
            blockUsed: store.comment.blockUsed,
            loading: store.loading[GET_COMMENTS_BLOCKS],
        }),
        shallowEqual,
    );

    // 페이지 구분값 ( id, ip, word)
    const pageGubunMemo = useMemo(() => pageGubun, [pageGubun]);

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeBannedsSearchOption(temp));
            dispatch(getCommentsBlocks());
        },
        [dispatch, search],
    );

    // 더블 클릭하면 최초 렌더링 한 상태로 css 를 업데이트.
    // const resetRowHeight = () => {
    //     gridApi.resetRowHeights(); // 리셋. 리셋을 해주 않으면 css 가 꺠지는 현상이 있어서 무조건 한번 리셋.

    //     gridApi.refreshCells({
    //         force: true,
    //     });

    //     // 그리드 row 를 기존 css 로 변경 처리.
    //     gridApi.forEachNode(function (rowNode) {
    //         for (var j = 0; j < rowNode.gridOptionsWrapper.columnController.allDisplayedColumns.length; j++) {
    //             if (rowNode.gridOptionsWrapper.columnController.allDisplayedColumns[j].colDef.field === 'tagDesc') {
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

    //     // 새로 고침 처리.
    //     gridApi.refreshCells({
    //         force: true,
    //     });

    //     gridApi.resetRowHeights();
    //     gridApi.onRowHeightChanged();
    // };

    // 더블 클릭 했을경우.
    // const handleDoubleClickListRow = (params) => {
    //     resetRowHeight();

    //     if (selectDoubleClickRow.current === params.data.cmtSeq) {
    //         selectDoubleClickRow.current = null;
    //         return false;
    //     }

    //     selectDoubleClickRow.current = params.data.cmtSeq;

    //     // 혹시 몰라서 텀을 약간 줌.
    //     setTimeout(function () {
    //         // gridStartRowReset(params);
    //     }, 500);

    //     gridApi.redrawRows();

    //     const focusedCell = params.api.getFocusedCell();

    //     const row = gridApi.getDisplayedRowAtIndex(focusedCell.rowIndex);

    //     focusedCell.column.colDef.cellStyle = '';

    //     gridApi.forEachNode(function (rowNode) {
    //         if (rowNode.data && rowNode.data.seqNo === params.data.seqNo) {
    //             rowNode.setRowHeight();
    //         }
    //     });
    //     gridApi.refreshCells({
    //         force: true,
    //     });
    //     gridApi.redrawRows({ rowNodes: [row] });
    //     gridApi.onRowHeightChanged();
    // };

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
        // setSelectBannedItem(gridApi.getSelectedRows());
    };

    useEffect(() => {
        setRowData(
            list.map((element) => {
                let tagValue = element.tagValue;
                let tagSource = '';

                if (pageGubunMemo === 'U' && tagValue.indexOf('@') > 0) {
                    const tempTagValueArray = tagValue.split('@');
                    tagValue = tempTagValueArray[0];
                    tagSource = tempTagValueArray[1];
                }

                // 2021-01-25 09:31  tagDesc 내용과 등록자가 같이 붙어 있어서 _ 구분자로 앞에 내용만 뿌려주기로.
                let tagDesc = element.tagDesc;

                if (tagDesc && tagDesc !== undefined && tagDesc !== null && tagDesc.indexOf('_') > 0) {
                    const tempTagDescArray = tagDesc.split('_');
                    tagDesc = tempTagDescArray[0];
                }

                let regMemberId = '';
                let regMemberNm = '';
                let regMemberInfo = '';

                if (element.regMember) {
                    regMemberId = element.regMember.memberId;
                    regMemberNm = element.regMember.memberNm;
                    regMemberInfo = `${element.regMember.memberNm}(${element.regMember.memberId})`;
                }

                let regDt = element.regDt && element.regDt.length > 10 ? element.regDt.substr(0, 16) : element.regDt;

                return {
                    ...element,
                    bannedElement: element,
                    tagValue: tagValue,
                    tagSource: tagSource,
                    tagDesc: tagDesc,
                    cdNm: element.tagDivCode.cdNm,
                    regDt: regDt,
                    memberId: regMemberId,
                    memberNm: regMemberNm,
                    regMemberInfo: regMemberInfo,
                    historyInfo: {
                        tagType: element.tagType,
                        tagValue: element.tagValue,
                        seqNo: element.seqNo,
                    },
                };
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    return (
        <CommentAgGrid
            loading={loading}
            columnDefs={BannedColumnDefs[pageGubunMemo]}
            total={total}
            page={search.page}
            size={search.size}
            rowData={rowData}
            rowHeight={50}
            getRowNodeId={(params) => params.seqNo}
            onRowSelected={(e) => handleGridRowSelected(e)}
            onColumnResized={(e) => onColumnResized(e)}
            onColumnVisible={(e) => onColumnVisible(e)}
            // onRowDoubleClicked={(e) => handleDoubleClickListRow(e)}
            onGridReady={(e) => onGridReady(e)}
            changeSearchOption={(e) => handleChangeSearchOption(e)}
            preventRowClickCell={['bannedElement', 'historyInfo']}
        />
    );
};

export default BannedListBox;
