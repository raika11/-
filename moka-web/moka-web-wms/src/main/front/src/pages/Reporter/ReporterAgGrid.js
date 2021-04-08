import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { MokaTable } from '@components';
import { columnDefs } from './ReporterAgGridColumns';
import { BASIC_DATEFORMAT, JPLUS_REP_DIV_DEFAULT } from '@/constants';
import { changeSearchOption, GET_REPORTER_LIST, getReporterList } from '@store/reporter';
import moment from 'moment';

/**
 * 기자 관리 > 기자 목록 AgGrid
 */
const ReporterMgrAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [reporterRows, setRepoterRows] = useState([]);

    const { reporter, list, total, search, loading } = useSelector((store) => {
        return {
            reporter: store.reporter.reporter,
            list: store.reporter.list,
            total: store.reporter.total,
            search: store.reporter.search,
            loading: store.loading[GET_REPORTER_LIST],
        };
    }, shallowEqual);

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getReporterList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        setRepoterRows(
            list.map((row) => ({
                ...row,
                jplusRepDivNm: (row.jplusRepDivNm || JPLUS_REP_DIV_DEFAULT).slice(0, 2),
                id: String(row.repSeq),
                modDt: row.modDt && moment(row.modDt).format(BASIC_DATEFORMAT),
            })),
        );
    }, [list]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (list) => {
            history.push(`${match.path}/${list.id}`);
        },
        [history, match.path],
    );

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={reporterRows}
            rowHeight={45}
            onRowNodeId={(reporter) => reporter.repSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={reporter.repSeq}
            preventRowClickCell={['reporterPage']}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default ReporterMgrAgGrid;
