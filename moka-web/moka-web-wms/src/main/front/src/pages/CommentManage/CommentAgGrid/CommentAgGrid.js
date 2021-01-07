import React, { useCallback, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import clsx from 'clsx';
import { MokaPagination, MokaLoader } from '@components';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';

/**
 * 댓글 AgGrid 목록
 */
const CommentAgGrid = (props) => {
    const { loading, total, page, size, columnDefs, localeText, onColumnResized, onColumnVisible, onGridReady, changeSearchOption, frameworkComponents } = props;

    const tempEvent = (e) => {
        console.log(e);
    };

    const onColumnValueChanged = (e) => {
        console.log('Event Value Changed', e);
    };

    // https://www.ag-grid.com/javascript-grid-row-height/
    // 높이를 가변으로 할떄 ag-grid 가이드.
    return (
        <React.Fragment>
            <div className={clsx('ag-theme-moka-grid position-relative overflow-hidden flex-fill', { 'ag-header-no': false })}>
                {/* <div className="ag-theme-moka-desking-grid position-relative px-1"> */}
                {loading && <MokaLoader />}
                <AgGridReact
                    // immutableData
                    defaultColDef={{
                        wrapText: true,
                        autoHeight: true,
                        // resizable: true,
                    }}
                    onGridReady={onGridReady}
                    getRowNodeId={(params) => params.commentSeq}
                    columnDefs={columnDefs}
                    localeText={localeText}
                    onRowSelected={tempEvent}
                    rowSelection="multiple"
                    // frameworkComponents={{ infoRenderer: InfoItemRenderer }}
                    onColumnResized={onColumnResized}
                    onColumnVisible={onColumnVisible}
                    frameworkComponents={frameworkComponents}
                    onColumnValueChanged={onColumnValueChanged}
                />
            </div>
            <div className="mt-3">
                <MokaPagination total={total} page={page} size={size} displayPageNum={DISPLAY_PAGE_NUM} onChangeSearchOption={changeSearchOption} pageSizes={PAGESIZE_OPTIONS} />
            </div>
        </React.Fragment>
    );
};

export default CommentAgGrid;
