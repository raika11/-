import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './RunStateAgGridColumns';
import { getJobStatisticList, changeRunStateSearchOption, GET_JOB_STATISTIC_LIST } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 작업 실행상태 현황 AgGrid
 */
const RunStateAgGrid = () => {
    const dispatch = useDispatch();

    const total = useSelector((store) => store.schedule.runState.statisticTotal);
    const list = useSelector((store) => store.schedule.runState.statisticList);
    const search = useSelector((store) => store.schedule.runState.search);
    const loading = useSelector((store) => store.loading[GET_JOB_STATISTIC_LIST]);

    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 row 클릭
     */
    const handleRowClicked = useCallback((row) => {}, []);

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getJobStatisticList(changeRunStateSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        dispatch(getJobStatisticList());
    }, [dispatch]);

    useEffect(() => {
        setRowData(
            list.map((job) => ({
                ...job,
                ab30: `${job.a30}개, ${job.b30}초`,
                ab60: `${job.a60}개, ${job.b60}초`,
                ab120: `${job.a120}개, ${job.b120}초`,
                ab300: `${job.a300}개, ${job.b300}초`,
                ab600: `${job.a600}개, ${job.b600}초`,
                ab1200: `${job.a1200}개, ${job.b1200}초`,
                ab1800: `${job.a1800}개, ${job.b1800}초`,
                ab3600: `${job.a3600}개, ${job.b3600}초`,
                ab43200: `${job.a43200}개, ${job.b43200}초`,
                ab86400: `${job.a86400}개, ${job.b86400}초`,
            })),
        );
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(row) => row.serverSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            // selected={}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default RunStateAgGrid;
