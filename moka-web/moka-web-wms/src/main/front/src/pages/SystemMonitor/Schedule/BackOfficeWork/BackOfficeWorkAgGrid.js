import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { MokaTable } from '@/components';
import columnDefs from './BackOfficeWorkAgGridColumns';
import { BASIC_DATEFORMAT, SCHEDULE_STATUS } from '@/constants';
import { GET_JOB_HISTORY_LIST, getJobHistoryList, changeBackOfficeWorkSearchOption } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 백오피스 예약작업 목록 AgGrid
 */
const BackOfficeWorkAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const total = useSelector((store) => store.schedule.backOffice.total);
    const list = useSelector((store) => store.schedule.backOffice.list);
    const search = useSelector((store) => store.schedule.backOffice.search);
    const backOfficeJob = useSelector((store) => store.schedule.backOffice.backOfficeJob);
    const loading = useSelector((store) => store.loading[GET_JOB_HISTORY_LIST]);

    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 row 클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`${match.path}/back-office-work/${row.seqNo}`);
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
            dispatch(getJobHistoryList(changeBackOfficeWorkSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        let findIndex = (status) => SCHEDULE_STATUS.findIndex((s) => s.status === status);
        setRowData(
            list.map((job) => {
                let targetIndex = findIndex(job.status);
                return {
                    ...job,
                    reserveDt: job.reserveDt ? moment(job.reserveDt).format(BASIC_DATEFORMAT) : '',
                    startDt: job.startDt ? moment(job.startDt).format(BASIC_DATEFORMAT) : '',
                    endDt: job.endDt ? moment(job.endDt).format(BASIC_DATEFORMAT) : '',
                    statusNm: SCHEDULE_STATUS[targetIndex].statusNm || '',
                };
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    return (
        <MokaTable
            agGridHeight={544}
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(row) => row.seqNo}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={backOfficeJob.seqNo}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default BackOfficeWorkAgGrid;
