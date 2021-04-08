import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './BulkMonitorRcvProgsAgGridColumns';
import RcvProgsModal from './modals/RcvProgsModal';
import RcvProgsBulkLogModal from './modals/RcvProgsBulkLogModal';
import { unescapeHtml } from '@utils/convertUtil';
import { changeBmSearchOption, getBulkStatList, GET_BULK_STAT_LIST } from '@/store/bulks';

/**
 * 벌크 모니터링 목록
 */
const BulkMonitorRcvProgsAgGrid = () => {
    const total = useSelector((store) => store.bulkMonitor.total);
    const search = useSelector((store) => store.bulkMonitor.search);
    const sendList = useSelector((store) => store.bulkMonitor.sendList);
    const loading = useSelector((store) => store.loading[GET_BULK_STAT_LIST]);
    const [rowData, setRowData] = useState([]);
    const [showRcvProgsModal, setShowRcvProgsModal] = useState(false);
    const [showBulkLogModal, setShowBulkLogModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const dispatch = useDispatch();

    const handleClickValue = useCallback((data, type) => {
        setModalData({ ...data, type });
        setShowRcvProgsModal(true);
    }, []);

    const handleClickBulkLog = useCallback((data) => {
        setModalData({ ...data });
        setShowBulkLogModal(true);
    }, []);

    /**
     * 테이블 옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getBulkStatList(changeBmSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        // row 생성
        setRowData(
            sendList.map((data) => ({
                ...data,
                title: unescapeHtml(data.title),
                handleClickValue,
                handleClickBulkLog,
            })),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendList]);

    return (
        <>
            <MokaTable
                className="overflow-hidden flex-fill ag-grid-align-center"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(params) => params.logSeq}
                loading={loading}
                page={search.page}
                size={search.size}
                total={total}
                preventRowClickCell={['status', 'naverStatus', 'daumStatus', 'nateStatus', 'zoomStatus', 'kpfStatus', 'bulkLogBtn']}
                onChangeSearchOption={handleChangeSearchOption}
                /*paging={false}*/
            />
            <RcvProgsModal show={showRcvProgsModal} onHide={() => setShowRcvProgsModal(false)} data={modalData} />
            <RcvProgsBulkLogModal show={showBulkLogModal} onHide={() => setShowBulkLogModal(false)} data={modalData} />
        </>
    );
};

export default BulkMonitorRcvProgsAgGrid;
