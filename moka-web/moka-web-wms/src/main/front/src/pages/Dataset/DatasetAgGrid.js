import React, { useCallback, useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { columnDefs } from './DatasetAgGridColumns';
import { GET_DATASET_LIST, changeSearchOption, getDatasetList, initialState } from '@store/dataset';
import { useHistory } from 'react-router-dom';

/**
 * 데이터셋 AgGrid 컴포넌트
 */
const DatasetAgGrid = (props) => {
    const { onDelete } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const [search, setSearch] = useState(initialState);
    const [datasetRows, setDatasetRows] = useState([]);

    const { dataset, list, search: storeSearch, total, loading } = useSelector(
        (store) => ({
            dataset: store.dataset.dataset,
            list: store.dataset.list,
            search: store.dataset.search,
            total: store.dataset.total,
            loading: store.loading[GET_DATASET_LIST],
        }),
        shallowEqual,
    );

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        setDatasetRows(
            list.map((row) => ({
                id: String(row.datasetSeq),
                datasetSeq: row.datasetSeq,
                datasetName: row.datasetName,
                autoCreateYn: row.autoCreateYn,
                usedYn: row.usedYn,
                onDelete,
            })),
        );
    }, [list, onDelete]);
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
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            size={storeSearch.size}
            page={storeSearch.page}
            total={total}
            rowData={datasetRows}
            loading={loading}
            selected={dataset.datasetSeq}
            onRowNodeId={(rowData) => rowData.id}
            onChangeSearchOption={handleChangeSearchOption}
            onRowClicked={handleRowClicked}
            suppressRefreshCellAfterUpdate
        />
    );
};

export default DatasetAgGrid;
