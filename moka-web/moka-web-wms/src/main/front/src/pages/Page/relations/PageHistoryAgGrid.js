import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { MokaTable } from '@components';
import { GET_HISTORY_LIST, getHistoryList, changeSearchHistOption } from '@store/page';
import columnDefs from './PageHistoryAgGridColumns';

/**
 * 페이지 히스토리 AgGrid 목록
 */
const PageHistoryAgGrid = (props) => {
    const dispatch = useDispatch();
    const { search, total, list, loading } = useSelector(
        (store) => ({
            search: store.pageHistory.search,
            total: store.pageHistory.total,
            list: store.pageHistory.list,
            loading: store.loading[GET_HISTORY_LIST],
        }),
        shallowEqual,
    );

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            dispatch(
                getHistoryList(
                    changeSearchHistOption({
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
    const handleRowClicked = useCallback(() => {}, []);

    return (
        <MokaTable
            agGridHeight={625}
            columnDefs={columnDefs}
            rowData={list}
            onRowNodeId={(history) => history.seq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            preventRowClickCell={['preview', 'link']}
        />
    );
};

export default PageHistoryAgGrid;
