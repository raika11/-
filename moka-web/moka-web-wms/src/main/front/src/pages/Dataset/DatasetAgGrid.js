import React, { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { columnDefs } from './DatasetAgGridColumns';
import { GET_DATASET_LIST, changeSearchOption, getDatasetList, initialState } from '@store/dataset';
import { useHistory } from 'react-router-dom';

/**
 * 데이터셋 관리 > 데이터셋 목록 > AgGrid
 */
const DatasetAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [search, setSearch] = useState(initialState);
    const [datasetRows, setDatasetRows] = useState([]);
    const loading = useSelector(({ loading }) => loading[GET_DATASET_LIST]);
    const { dataset, list, search: storeSearch, total } = useSelector(({ dataset }) => dataset, shallowEqual);

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

    /**
     * 데이터셋 등록
     */
    const handleClickAddDataSet = (event) => {
        event.preventDefault();
        event.stopPropagation();
        history.push(`${match.path}/add`);
    };

    useEffect(() => {
        setDatasetRows(
            list.map((row) => ({
                id: String(row.datasetSeq),
                datasetSeq: row.datasetSeq,
                datasetName: row.datasetName,
                autoCreateYn: row.autoCreateYn,
                usedYn: row.usedYn,
            })),
        );
    }, [list]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    return (
        <>
            <div className="d-flex justify-content-end mb-14">
                <Button variant="positive" onClick={handleClickAddDataSet}>
                    데이터셋 등록
                </Button>
            </div>
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
        </>
    );
};

export default DatasetAgGrid;
