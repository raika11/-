import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import columnDefs from './ReporterDeskAgGridColums';
import { changeSearchOption, GET_REPORTER_LIST, getReporterList } from '@store/reporter';

/**
 * 페이지편집 > 기자 목록 AgGrid
 */
const ReporterDeskAgGrid = forwardRef((props, ref) => {
    // const { onDragStop, dropTargetAgGrid } = props;
    const dispatch = useDispatch();
    const [reporterRows, setRepoterRows] = useState([]);

    const reporter = useSelector((store) => store.reporter.reporter);
    const list = useSelector((store) => store.reporter.list);
    const total = useSelector((store) => store.reporter.total);
    const search = useSelector((store) => store.reporter.search);
    const loading = useSelector((store) => store.loading[GET_REPORTER_LIST]);

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
                id: String(row.repSeq),
                belong:
                    (row.r1CdNm ? `${row.r1CdNm} / ` : '') + (row.r2CdNm ? `${row.r2CdNm} / ` : '') + (row.r3CdNm ? `${row.r3CdNm} / ` : '') + (row.r4CdNm ? `${row.r4CdNm}` : ''),
            })),
        );
    }, [list]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((list) => {
        // history.push(`${match.path}/${list.id}`);
    }, []);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={reporterRows}
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
});

export default ReporterDeskAgGrid;
