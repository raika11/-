import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './BulkMonitorRcvProgsAgGridColumns';
import RcvProgsModal from './modals/RcvProgsModal';
import RcvProgsBulkLogModal from './modals/RcvProgsBulkLogModal';
import { unescapeHtml } from '@utils/convertUtil';
import { changeBmSearchOption, GET_BULK_STAT_LIST } from '@/store/bulks';
import produce from 'immer';

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

    const handleChangeSearchOption = (option) => {
        const { key, value } = option;
        dispatch(
            changeBmSearchOption(
                produce(search, (draft) => {
                    draft[key] = value;
                    if (key === 'size') {
                        draft['page'] = 0;
                    }
                }),
            ),
        );
    };

    useEffect(() => {
        // row 생성
        if (sendList.length > 0) {
            setRowData(
                sendList.map((data) => ({
                    ...data,
                    title: unescapeHtml(data.title),
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
