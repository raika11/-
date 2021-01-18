import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { AgGridReact } from 'ag-grid-react';
import { MokaCard, MokaLoader, MokaPagination } from '@/components';
import columnDefs, { list } from './BulKMonitorRcvprogsAgGridColumns.js';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';
import RcvProgsRenderer from './components/RcvProgsRenderer.js';
import RcvprogsModal from './modals/RcvprogsModal.js';
/**
 * 벌크 모니터링 목록
 */
const BulKMonitorRcvprogsAgGrid = () => {
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 0, size: 20 });
    const [rowData, setRowData] = useState([]);
    const [showRcvprogsModal, setShowRcvprogsModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const preventRowClickCell = ['loader', 'dump', 'naver', 'daum', 'nate', 'zoom'];

    const getRowHeight = useCallback((params) => {
        const dtKeys = Object.keys(params.data).filter((dtKey) => {
            return dtKey.includes('Dt');
        });
        let dtVal = [];

        for (let i = 0; i < dtKeys.length; i++) {
            if (params.data[dtKeys[i]] !== null) {
                dtVal.push(params.data[dtKeys[i]]);
            }
        }

        return dtVal.length > 0 ? 65 : 34;
    }, []);

    const onColumnResized = (params) => {
        params.api.resetRowHeights();
    };

    const onColumnVisible = (params) => {
        params.api.resetRowHeights();
    };

    /**
     * 테이블 검색 옵션 변경
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            if (preventRowClickCell.includes(row.colDef.field)) {
                return;
            } else {
                console.log(row);
            }
        },
        [preventRowClickCell],
    );

    const handleClickValue = (value) => {
        if (value === '완료' || value === '실패') {
            setShowRcvprogsModal(true);
            setModalData(value);
        } else {
            return;
        }
    };

    useEffect(() => {
        // row 생성
        setRowData(
            list.map((data) => ({
                ...data,
                handleClickValue,
                // handleClickPreview,
            })),
        );
    }, []);

    return (
        <>
            <MokaCard className="w-100" bodyClassName="d-flex flex-column" height={500} header={false}>
                <div className={clsx('ag-theme-moka-grid ag-grid-align-center position-relative overflow-hidden flex-fill')}>
                    {loading && <MokaLoader />}
                    <AgGridReact
                        rowData={rowData}
                        defaultColDef={{
                            wrapText: true,
                            autoHeight: true,
                        }}
                        // onGridReady={onGridReady}
                        getRowNodeId={(params) => params.seqNo}
                        columnDefs={columnDefs}
                        frameworkComponents={{ RcvProgsRenderer: RcvProgsRenderer }}
                        // localeText={localeText}
                        getRowHeight={getRowHeight}
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
            </MokaCard>
            <RcvprogsModal show={showRcvprogsModal} onHide={() => setShowRcvprogsModal(false)} data={modalData} />
        </>
    );
};

export default BulKMonitorRcvprogsAgGrid;
