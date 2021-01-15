import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { AgGridReact } from 'ag-grid-react';
import { MokaLoader, MokaPagination } from '@/components';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';
import columnDefs, { rowData, localeText } from './MicPostListAgGridColumns';
import PostEditMadal from './modals/PostEditModal';

/**
 * 시민 마이크 포스트 목록 AgGrid
 */
const MicPostListAgGrid = () => {
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    const [gridReadyState, setGridReadyState] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [showPeModal, setShowPeModal] = useState(false);
    const [rd, setRd] = useState(null);

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        setGridReadyState(true);

        setTimeout(function () {
            // params.api.setRowData(createRowData());
            // setGridRowData(params);
        }, 500);
    };
    const onColumnResized = (params) => {
        params.api.resetRowHeights();
    };

    const onColumnVisible = (params) => {
        params.api.resetRowHeights();
    };

    useEffect(() => {
        if (gridApi) {
            setTimeout(function () {
                gridApi.setRowData(rowData);
            }, 500);
        }
    }, [gridApi]);

    const handleRowClicked = useCallback((row) => {
        if (row.colDef.field === 'state') {
            return;
        } else {
            setShowPeModal(true);
            setRd(row.node.data);
        }
    }, []);

    const handleChangeSearchOption = useCallback((search) => {
        console.log(search);
    }, []);

    return (
        <>
            <div className="d-flex justify-content-end">
                <p>{total}건</p>
            </div>
            <div className={clsx('ag-theme-moka-grid position-relative overflow-hidden flex-fill')}>
                {loading && <MokaLoader />}
                <AgGridReact
                    defaultColDef={{
                        wrapText: true,
                        autoHeight: true,
                    }}
                    onGridReady={onGridReady}
                    getRowNodeId={(params) => params.seqNo}
                    columnDefs={columnDefs}
                    localeText={localeText}
                    onColumnResized={onColumnResized}
                    onColumnVisible={onColumnVisible}
                    onCellClicked={handleRowClicked}
                />
            </div>
            <div className="mt-3">
                <MokaPagination
                    showTotalString={false}
                    page={search.page}
                    size={search.size}
                    displayPageNum={DISPLAY_PAGE_NUM}
                    onChangeSearchOption={handleChangeSearchOption}
                    pageSizes={PAGESIZE_OPTIONS}
                />
            </div>
            <PostEditMadal show={showPeModal} onHide={() => setShowPeModal(false)} data={rd} />
        </>
    );
};

export default MicPostListAgGrid;
