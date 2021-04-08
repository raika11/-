import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { MokaTable } from '@/components';
import columnDefs from './DeleteWorkAgGridColumns';
import { SCHEDULE_PERIOD, DB_DATEFORMAT } from '@/constants';
import { GET_DELETE_JOB_LIST, getJobList, changeDeleteWorkSearchOption } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 삭제 작업 목록 AgGrid
 */
const DeleteWorkAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const total = useSelector((store) => store.schedule.deleteWork.total);
    const list = useSelector((store) => store.schedule.deleteWork.list);
    const search = useSelector((store) => store.schedule.deleteWork.search);
    const deleteJob = useSelector((store) => store.schedule.deleteWork.deleteJob);
    const loading = useSelector((store) => store.loading[GET_DELETE_JOB_LIST]);

    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 row 클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`${match.path}/work-delete/${row.jobSeq}`);
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
            dispatch(getJobList(changeDeleteWorkSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        // 스케줄 작업 카테고리를 가져와서 categoryNm 매핑
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
                            delInfo: `${moment(job.modDt).format(DB_DATEFORMAT)} ${job.modMember.memberNm || ''}(${job.modMember.memberId || ''})`,
                        };
                    } else {
                        return {
                            ...job,
                            categoryNm: job.category,
                            periodNm: SCHEDULE_PERIOD[periodIndex].periodNm,
                            delInfo: `${moment(job.modDt).format(DB_DATEFORMAT)} ${job.modMember.memberNm || ''}(${job.modMember.memberId || ''})`,
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
            selected={deleteJob.jobSeq}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default DeleteWorkAgGrid;
