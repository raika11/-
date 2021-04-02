import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './RunStateSearchAgGridColumns';
import { SCHEDULE_PERIOD } from '@/constants';
import { GET_JOB_STATISTIC_SEARCH_LIST, getJobStatisticSearchList, changeRunStateSearchOption } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 작업 실행상태 AgGrid
 */
const RunStateSearchAgGrid = () => {
    const dispatch = useDispatch();
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const total = useSelector((store) => store.schedule.runState.runStateTotal);
    const list = useSelector((store) => store.schedule.runState.runStateList);
    const search = useSelector((store) => store.schedule.runState.search);
    const loading = useSelector((store) => store.loading[GET_JOB_STATISTIC_SEARCH_LIST]);

    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 row 클릭
     */
    const handleRowClicked = useCallback((row) => {
        // console.log(row);
    }, []);

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
            dispatch(getJobStatisticSearchList(changeRunStateSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        setRowData(
            list.map((job) => {
                let targetIndex = SCHEDULE_PERIOD.findIndex((p) => p.period === job.period);
                let cateIndex = genCateRows.findIndex((c) => c.id === job.category);

                return {
                    ...job,
                    category: genCateRows[cateIndex]?.name || job.category,
                    serverNm: job.distributeServerSimple?.serverNm,
                    periodNm: SCHEDULE_PERIOD[targetIndex].periodNm || '',
                };
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(row) => row.jobSeq}
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

export default RunStateSearchAgGrid;
