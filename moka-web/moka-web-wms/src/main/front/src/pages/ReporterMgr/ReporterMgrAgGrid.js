import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { MokaTable } from '@components';
import { columnDefs, rowData } from './ReporterMgrAgGridColumns';
import { initialState, changeSearchOption, GET_REPORTER_LIST, getReporterList, getReporter } from '@store/reporter';

/**
 * 기자 목록 AgGrid
 */
const ReporterMgrAgGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    // const { reporter, list, total, search, loading } = useSelector((store) => ({
    //     reporter: store.reporter.reporter,
    //     list: store.reporter.list,
    //     total: store.reporter.total,
    //     search: store.reporter.search,
    //     loading: store.loading[GET_REPORTER_LIST],
    // }));

    // useEffect(() => {
    //     // 기자 목록
    //     dispatch(getReporterList());
    // }, [dispatch]);

    // 퍼블리싱용 state 개발하실 때 삭제바랍니다.
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    // /**
    //  * 테이블에서 검색옵션 변경
    //  */
    // const handleChangeSearchOption = useCallback(
    //     ({ key, value }) => {
    //         let temp = { ...search, [key]: value };
    //         if (key !== 'page') {
    //             temp['page'] = 0;
    //         }
    //         dispatch(getReporterList(changeSearchOption(temp)));
    //     },
    //     [dispatch, search],
    // );

    // /**
    //  * 목록에서 Row클릭
    //  */
    // const handleRowClicked = useCallback(
    //     (list) => {
    //         //console.log("list::" + this.list.id);
    //         // dispatch(getReporterMgr());
    //         history.push(`/reporterMgr/${list.repSeq}`);
    //     },
    //     [history],
    // );

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(reporter) => reporter.repSeq}
            agGridHeight={660}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            // selected={reporter.repSeq}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default ReporterMgrAgGrid;
