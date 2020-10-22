import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { changeSearchOption, getDomainList, initialState } from '@store/domain';
import { columnDefs } from './DomainAgGridColumns';

/**
 * 도메인 AgGrid 목록
 */
const DomainAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [search, setSearch] = useState(initialState);
    const { domain, list, total, search: storeSearch, loading } = useSelector(
        (store) => ({
            domain: store.domain.domain,
            list: store.domain.list,
            total: store.domain.total,
            search: store.domain.search,
        }),
        shallowEqual,
    );

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getDomainList());
    }, [dispatch]);

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            dispatch(
                getDomainList(
                    changeSearchOption({
                        ...search,
                        [key]: value,
                        page: 0,
                    }),
                ),
            );
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((rowData) => history.push(`/domain/${rowData.domainId}`), [history]);

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={list}
            onRowNodeId={(rowData) => rowData.domainId}
            agGridHeight={600}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={domain.domainId}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default DomainAgGrid;
