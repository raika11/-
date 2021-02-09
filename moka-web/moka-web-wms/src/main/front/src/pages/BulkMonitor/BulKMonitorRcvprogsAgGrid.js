import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { AgGridReact } from 'ag-grid-react';
import { MokaLoader } from '@/components';
import columnDefs from './BulKMonitorRcvprogsAgGridColumns.js';
import RcvprogsModal from './modals/RcvprogsModal.js';
import { GET_BULK_STAT_LIST } from '@/store/bulks';

const propTypes = {};

const defaultProps = {
    localeText: { noRowsToShow: '조회 결과가 없습니다', loadingOoo: '조회 중입니다' },
};

/**
 * 벌크 모니터링 목록
 */
const BulKMonitorRcvprogsAgGrid = () => {
    const search = useSelector((store) => store.bulkMonitor.search);
    const sendList = useSelector((store) => store.bulkMonitor.sendList);
    const loading = useSelector((store) => store.loading[GET_BULK_STAT_LIST]);
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
     * 목록 Row클릭
     */
    const handleRowClicked = (row) => {
        if (preventRowClickCell.includes(row.colDef.field)) {
            return;
        } else {
            console.log(row);
        }
    };

    const handleClickValue = (value) => {
        if (value === '완료' || value === '실패') {
            setShowRcvprogsModal(true);
            setModalData(value);
        } else {
            return;
        }
    };

    const handleClickBulkLog = (value) => {};

    useEffect(() => {
        // row 생성
        if (sendList.length > 0) {
            setRowData(
                sendList.map((data) => ({
                    ...data,
                    handleClickValue,
                    handleClickBulkLog,
                })),
            );
        }
    }, [sendList]);

    return (
        <>
            <div className={clsx('ag-theme-moka-grid ag-grid-align-center position-relative overflow-hidden flex-fill')}>
                {loading && <MokaLoader />}
                <AgGridReact
                    rowData={rowData}
                    defaultColDef={{
                        wrapText: true,
                        autoHeight: true,
                    }}
                    localeText={{ noRowsToShow: '조회 결과가 없습니다', loadingOoo: '조회 중입니다' }}
                    getRowNodeId={(params) => params.orgSourceName}
                    columnDefs={columnDefs}
                    getRowHeight={getRowHeight}
                    onColumnResized={onColumnResized}
                    onColumnVisible={onColumnVisible}
                    onCellClicked={handleRowClicked}
                />
            </div>
            <RcvprogsModal show={showRcvprogsModal} onHide={() => setShowRcvprogsModal(false)} data={modalData} />
        </>
    );
};

BulKMonitorRcvprogsAgGrid.propTypes = propTypes;
BulKMonitorRcvprogsAgGrid.defaultProps = defaultProps;

export default BulKMonitorRcvprogsAgGrid;
