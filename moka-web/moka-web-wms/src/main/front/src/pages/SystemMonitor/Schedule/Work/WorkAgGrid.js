import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@/components';
import columnDefs from './WorkAgGridColumns';
import { GET_JOB_LIST, getJobList, changeWorkSearchOption } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 작업 목록 AgGri
 */
const WorkAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const total = useSelector((store) => store.schedule.work.total);
    const list = useSelector((store) => store.schedule.work.list);
    const job = useSelector((store) => store.schedule.work.job);
    const search = useSelector((store) => store.schedule.work.search);
    const loading = useSelector((store) => store.loading[GET_JOB_LIST]);

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

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={list}
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
