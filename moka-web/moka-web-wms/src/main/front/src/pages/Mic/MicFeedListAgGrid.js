import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import { AgGridReact } from 'ag-grid-react';
import { MokaLoader, MokaPagination } from '@/components';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';
import columnDefs, { rowData, localeText } from './MicFeedListAgGridColumns';
import FeedEditModal from './modals/FeedEditModal';

/**
 * 시민 마이크 피드 목록 AgGrid
 */
const MicFeedListAgGrid = () => {
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });
    const [rd, setRd] = useState(null);
    const [showFrModal, setShowFrModal] = useState(false);

    const [gridReadyState, setGridReadyState] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

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
    }, [gridReadyState, gridApi, gridColumnApi]);

    const handleClickAdd = () => {
        setShowFrModal(true);
        setRd(null);
    };

    /**
     * 테이블 검색 옵션 변경
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        if (row.colDef.field === 'usedYn' || row.colDef.field === 'menu') {
            return;
        } else {
            setShowFrModal(true);
            setRd(row.node.data);
        }
    }, []);

    return (
        <>
            <div className="mb-2 d-flex justify-content-end">
                <Button variant="positive" className="ft-12" onClick={handleClickAdd}>
                    등록
                </Button>
            </div>
            <div className={clsx('ag-theme-moka-grid position-relative overflow-hidden flex-fill')}>
                {loading && <MokaLoader />}
                <AgGridReact
                    defaultColDef={{
                        wrapText: true,
                        autoHeight: true,
                    }}
                    onGridReady={onGridReady}
                    getRowNodeId={(params) => params.commentSeq}
                    columnDefs={columnDefs}
                    localeText={localeText}
                    onColumnResized={onColumnResized}
                    onColumnVisible={onColumnVisible}
                    onCellClicked={handleRowClicked}
                />
            </div>
            <div className="mt-3">
                <MokaPagination
                    total={total}
                    page={search.page}
                    size={search.size}
                    displayPageNum={DISPLAY_PAGE_NUM}
                    onChangeSearchOption={handleChangeSearchOption}
                    pageSizes={PAGESIZE_OPTIONS}
                />
            </div>
            <FeedEditModal show={showFrModal} onHide={() => setShowFrModal(false)} data={rd} />
        </>
    );
};

export default MicFeedListAgGrid;
