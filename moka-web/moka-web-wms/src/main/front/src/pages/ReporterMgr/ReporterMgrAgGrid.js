import React, { useCallback, useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs } from './ReporterMgrAgGridColumns';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeSearchOption, GET_REPORTER_LIST, getReporterList, initialState } from '@store/reporter';

/**
 * group AgGrid 목록
 */

const ReporterMgrAgGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [search, setSearch] = useState(initialState);
    const [repoterMgrRows, setRepoterMgrRows] = useState([]);

    const { reporter, list, total, search: storeSearch, loading } = useSelector(
        (store) => ({
            reporter: store.reporter.reporter,
            list: store.reporter.list,
            total: store.reporter.total,
            search: store.reporter.search,
            loading: store.loading[GET_REPORTER_LIST],
        }),
        shallowEqual,
    );

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
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getReporterList());
    }, [dispatch]);

    useEffect(() => {
        setRepoterMgrRows(
            list.map((row) => ({
                id: String(row.groupCd),
                groupCd: row.groupCd,
                groupNm: row.groupNm,
                groupKorNm: row.groupKorNm,
                regDt: row.regDt,
            })),
        );
    }, [list]);

    /**
     * 목록에서 Row클릭
     */

    const handleRowClicked = useCallback(
        (list) => {
            //console.log("list::" + this.list.id);
            history.push(`/reporter/${list.id}`);
        },
        [history],
    );

    let count = 0;

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={repoterMgrRows}
            onRowNodeId={(rowData) => rowData.repSeq}
            agGridHeight={600}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={reporter.id}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default ReporterMgrAgGrid;
