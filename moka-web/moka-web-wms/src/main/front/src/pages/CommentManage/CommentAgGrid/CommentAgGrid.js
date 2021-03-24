import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import clsx from 'clsx';
import { MokaPagination, MokaLoader } from '@components';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';
import { DeleteButtonRenderer, DateItemRenderer, UserInfoRenderer, BanneButtonRenderer, HistoryButtonRenderer, MemSiteRenderer } from './CommentGridRenderer';

/**
 * 댓글 관리 > 댓글 목록 AgGrid
 * 기존 그리드와 다르게 가변 행높이 적용
 */
const CommentAgGrid = (props) => {
    const {
        loading,
        total,
        page,
        size,
        onColumnResized,
        onColumnVisible,
        onGridReady,
        changeSearchOption,
        rowData,
        rowHeight,
        onRowDoubleClicked,
        getRowHeight,
        onRowSelected,
        columnDefs,
        preventRowClickCell,
        getRowNodeId,
        onCellClicked,
        onRowClicked,
    } = props;

    // https://www.ag-grid.com/javascript-grid-row-height/
    // 높이를 가변으로 할떄 ag-grid 가이드.

    return (
        <>
            <div className={clsx('ag-theme-moka-grid position-relative overflow-hidden flex-fill ag-grid-comment', { 'ag-header-no': false })}>
                {loading && <MokaLoader />}
                <AgGridReact
                    immutableData
                    defaultColDef={{
                        wrapText: false,
                        // autoHeight: true,
                        // suppressColumnsToolPanel: true,
                        // suppressMenu: true,
                        // suppressSizeToFit: true,
                        // suppressPaste: true,
                        // suppressFiltersToolPanel: true,
                        // suppressMovable: true,
                        // suppressAutoSize: true,
                        // suppressCellFlash: true,
                        // resizable: true,
                    }}
                    onGridReady={onGridReady}
                    rowData={rowData}
                    rowHeight={rowHeight}
                    getRowNodeId={getRowNodeId}
                    columnDefs={columnDefs}
                    localeText={{ noRowsToShow: '조회 결과가 없습니다', loadingOoo: '조회 중입니다' }}
                    rowSelection="multiple"
                    onRowDoubleClicked={onRowDoubleClicked}
                    onRowClicked={onRowClicked}
                    onCellClicked={onCellClicked}
                    onColumnResized={onColumnResized}
                    onColumnVisible={onColumnVisible}
                    onRowSelected={onRowSelected}
                    getRowHeight={getRowHeight}
                    frameworkComponents={{
                        deleteButtonRenderer: DeleteButtonRenderer,
                        dateItemRenderer: DateItemRenderer,
                        userInfoRenderer: UserInfoRenderer,
                        banneButtonRenderer: BanneButtonRenderer,
                        historyButtonRenderer: HistoryButtonRenderer,
                        memSiteRenderer: MemSiteRenderer,
                    }}
                    preventRowClickCell={preventRowClickCell}
                />
            </div>
            <div className="mt-3">
                <MokaPagination total={total} page={page} size={size} displayPageNum={DISPLAY_PAGE_NUM} onChangeSearchOption={changeSearchOption} pageSizes={PAGESIZE_OPTIONS} />
            </div>
        </>
    );
};

export default CommentAgGrid;
