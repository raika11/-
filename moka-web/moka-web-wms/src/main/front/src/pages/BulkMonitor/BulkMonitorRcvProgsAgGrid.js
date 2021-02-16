import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './BulkMonitorRcvProgsAgGridColumns';
import RcvProgsModal from './modals/RcvProgsModal';
import RcvProgsBulkLogModal from './modals/RcvProgsBulkLogModal';
import { GET_BULK_STAT_LIST } from '@/store/bulks';

/**
 * 벌크 모니터링 목록
 */
const BulkMonitorRcvProgsAgGrid = () => {
    const search = useSelector((store) => store.bulkMonitor.search);
    const sendList = useSelector((store) => store.bulkMonitor.sendList);
    const loading = useSelector((store) => store.loading[GET_BULK_STAT_LIST]);
    const [rowData, setRowData] = useState([]);
    const [showRcvProgsModal, setShowRcvProgsModal] = useState(false);
    const [showBulkLogModal, setShowBulkLogModal] = useState(false);
    const [modalData, setModalData] = useState({});

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback((params) => {
        console.log(params);
    }, []);

    const handleClickValue = useCallback((data, type) => {
        setModalData({ ...data, type });
        setShowRcvProgsModal(true);
    }, []);

    const handleClickBulkLog = useCallback((data) => {
        setModalData({ ...data });
        setShowBulkLogModal(true);
    }, []);

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
        } else {
            setRowData([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleClickValue, sendList]);

    return (
        <>
            <MokaTable
                className="overflow-hidden flex-fill ag-grid-align-center"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(params) => params.logSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                page={search.page}
                size={search.size}
                preventRowClickCell={['status', 'naverStatus', 'daumStatus', 'nateStatus', 'zoomStatus', 'kpfStatus', 'bulkLogBtn']}
                paging={false}
            />
            <RcvProgsModal show={showRcvProgsModal} onHide={() => setShowRcvProgsModal(false)} data={modalData} />
            <RcvProgsBulkLogModal show={showBulkLogModal} onHide={() => setShowBulkLogModal(false)} data={modalData} />
        </>
    );
};

export default BulkMonitorRcvProgsAgGrid;
