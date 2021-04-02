import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@/components';
import columnDefs from './WorkAgGridColumns';
import { SCHEDULE_PERIOD } from '@/constants';
import { GET_JOB_LIST, getJobList, changeWorkSearchOption } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 작업 목록 AgGri
 */
const WorkAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const total = useSelector((store) => store.schedule.work.total);
    const list = useSelector((store) => store.schedule.work.list);
    const job = useSelector((store) => store.schedule.work.job);
    const search = useSelector((store) => store.schedule.work.search);
    const loading = useSelector((store) => store.loading[GET_JOB_LIST]);

    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 row 클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`${match.path}/work-list/${row.jobSeq}`);
        },
        [history, match.path],
    );

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
            dispatch(getJobList(changeWorkSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        // 스케줄 작업 카테고리를 가져와서 categoryNm 조회
        if (genCateRows) {
            let findIndex = (code) => genCateRows.findIndex((c) => c.dtlCd === code);
            let findPeriodIndex = (period) => SCHEDULE_PERIOD.findIndex((c) => c.period === period);

            setRowData(
                list.map((job) => {
                    let targetIndex = findIndex(job.category);
                    let periodIndex = findPeriodIndex(job.period);
                    if (targetIndex > -1) {
                        return {
                            ...job,
                            categoryNm: genCateRows[targetIndex].cdNm,
                            periodNm: SCHEDULE_PERIOD[periodIndex].periodNm,
                        };
                    } else {
                        return {
                            ...job,
                            categoryNm: job.category,
                            periodNm: SCHEDULE_PERIOD[periodIndex].periodNm,
                        };
                    }
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [genCateRows, list]);

    return (
        <MokaTable
            agGridHeight={544}
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(row) => row.jobSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={job.jobSeq}
            onChangeSearchOption={handleChangeSearchOption}
            refreshCellsParams={{
                force: true,
            }}
        />
    );
};

export default WorkAgGrid;
