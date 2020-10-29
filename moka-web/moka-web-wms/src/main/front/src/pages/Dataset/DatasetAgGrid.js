import React, { useCallback, useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import { columnDefs } from './DatasetAgGridColumns';
import { GET_DATASET_LIST, changeSearchOption, getDatasetList, initialState } from '@store/dataset';
import { useHistory } from 'react-router-dom';
/**
 * 데이터셋 AgGrid 컴포넌트
 */
const DatasetAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [search, setSearch] = useState(initialState);

    const { dataset, list, search: storeSearch, total, loading } = useSelector((store) => ({
        dataset: store.dataset.dataset,
        list: store.dataset.list,
        search: store.dataset.search,
        total: store.dataset.total,
        loading: store.loading[GET_DATASET_LIST],
    }));

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);
    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getDatasetList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((rowData) => history.push(`/dataset/${rowData.datasetSeq}`), [history]);

    return (
        <MokaTable
            columnDefs={columnDefs}
            agGridHeight={500}
            size={storeSearch.size}
            page={storeSearch.page}
            total={total}
            rowData={list}
            loading={loading}
            selected={dataset.datasetSeq}
            onRowNodeId={(rowData) => rowData.datasetSeq}
            onChangeSearchOption={handleChangeSearchOption}
            onRowClicked={handleRowClicked}
        />
    );
};

export default DatasetAgGrid;
