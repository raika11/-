import React, { useCallback, useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { columnDefs } from './DatasetAgGridColumns';
import { GET_DATASET_LIST, changeSearchOption, getDatasetList, initialState } from '@store/dataset';
import { useHistory } from 'react-router-dom';

/**
 * 데이터셋 AgGrid 컴포넌트
 */
const DatasetAgGrid = ({ onDelete, match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [search, setSearch] = useState(initialState);
    const [datasetRows, setDatasetRows] = useState([]);
    const loading = useSelector(({ loading }) => loading[GET_DATASET_LIST]);
    const { dataset, list, search: storeSearch, total } = useSelector(
        ({ dataset }) => ({
            dataset: dataset.dataset,
            list: dataset.list,
            search: dataset.search,
            total: dataset.total,
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
            dispatch(getDatasetList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((rowData) => history.push(`${match.path}/${rowData.datasetSeq}`), [history, match.path]);

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

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

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
            preventRowClickCell={['delete']}
        />
    );
};

export default DatasetAgGrid;
