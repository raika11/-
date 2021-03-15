import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './RunStateAgGridColumns';
import { getJobStatisticList, changeRunStateSearchOption, GET_JOB_STATISTIC_LIST } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 작업 실행상태 현황 AgGrid
 */
const RunStateAgGrid = () => {
    const dispatch = useDispatch();

    // 기타코드 스케줄 작업 목록
    // const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const total = useSelector((store) => store.schedule.runState.statisticTotal);
    const list = useSelector((store) => store.schedule.runState.statisticList);
    const search = useSelector((store) => store.schedule.runState.search);
    const loading = useSelector((store) => store.loading[GET_JOB_STATISTIC_LIST]);

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

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={list}
            onRowNodeId={(row) => row.serverSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            // selected={source.sourceCode}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default RunStateAgGrid;
