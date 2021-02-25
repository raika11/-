import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import clsx from 'clsx';
import { MokaPagination, MokaLoader } from '@components';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';
import { localeText } from './CommentAgGridColumns';
import { DeleteButtonRenderer, DateItemRenderer, UserInfoRenderer, BanneButtonRenderer, HistoryButtonRenderer, CommentItemRenderer } from './CommentGridRenderer';

/**
 * 댓글 AgGrid 목록
 * 기존 그리드와 다르게 높이를 늘렸다 줄였다 해야해서
 * ag그리드를 이용.
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
                {/* <div className="ag-theme-moka-desking-grid position-relative px-1"> */}
                {loading && <MokaLoader />}
                <AgGridReact
                    immutableData
                    defaultColDef={{
                        wrapText: true,
                        autoHeight: true,
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
                    rowData={rowData ? rowData : []}
                    rowHeight={32}
                    getRowNodeId={getRowNodeId}
                    columnDefs={columnDefs}
                    localeText={localeText}
                    rowSelection="multiple"
                    onRowDoubleClicked={onRowDoubleClicked}
                    onRowClicked={onRowClicked}
                    onCellClicked={onCellClicked}
                    onColumnResized={onColumnResized}
                    onColumnVisible={onColumnVisible}
                    onRowSelected={onRowSelected}
                    getRowHeight={getRowHeight}
                    // rowSelected={rowSelected}
                    frameworkComponents={{
                        deleteButtonRenderer: DeleteButtonRenderer,
                        dateItemRenderer: DateItemRenderer,
                        userInfoRenderer: UserInfoRenderer,
                        banneButtonRenderer: BanneButtonRenderer,
                        historyButtonRenderer: HistoryButtonRenderer,
                        commentItemRenderer: CommentItemRenderer,
                    }}
                    preventRowClickCell={preventRowClickCell}
                    // suppressRowClickSelection={false}
                />
            </div>
            <div className="mt-3">
                <MokaPagination total={total} page={page} size={size} displayPageNum={DISPLAY_PAGE_NUM} onChangeSearchOption={changeSearchOption} pageSizes={PAGESIZE_OPTIONS} />
            </div>
        </>
    );
};

export default CommentAgGrid;
