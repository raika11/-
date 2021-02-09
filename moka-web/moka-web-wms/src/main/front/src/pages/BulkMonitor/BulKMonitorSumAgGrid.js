import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import { changeBmSearchOption, getBulkStatTotal } from '@/store/bulks';
import columnDefs from './BulkMonitorSumAgGridColumns';

/**
 * 벌크 모니터링 현황
 */
const BulKMonitorSumAgGrid = () => {
    const dispatch = useDispatch();
    const search = useSelector((store) => store.bulkMonitor.search);
    const totalList = useSelector((store) => store.bulkMonitor.list);

    useEffect(() => {
        dispatch(
            getBulkStatTotal(
                changeBmSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, []);

    return (
        <div className="mb-5 d-flex align-items-center" style={{ width: 758 }}>
            <div className="mr-3">
                <p className="mb-0">
                    {search.startDt} ~ {search.endDt}
                </p>
                <p className="mb-0">벌크 현황 정보</p>
            </div>
            <MokaTable className="flex-fill ag-grid-align-center" columnDefs={columnDefs} onRowNodeId={(params) => params.progress} rowData={totalList} paging={false} />
        </div>
    );
};

export default BulKMonitorSumAgGrid;
