import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@/components';
import columnDefs from './DeleteWorkAgGridColumns';
import { GET_JOB_DELETE_LIST, getJobList, changeDeleteWorkSearchOption } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 삭제 작업 목록 AgGrid
 */
const DeleteWorkAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const total = useSelector((store) => store.schedule.deleteWork.total);
    const list = useSelector((store) => store.schedule.deleteWork.list);
    const search = useSelector((store) => store.schedule.deleteWork.search);
    const loading = useSelector((store) => store.loading[GET_JOB_DELETE_LIST]);

    /**
     * 테이블 row 클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`${match.path}/work-delete/${row.seqNo}`);
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

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={list}
            onRowNodeId={(row) => row.seqNo}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={(row) => row.seqNo}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default DeleteWorkAgGrid;
