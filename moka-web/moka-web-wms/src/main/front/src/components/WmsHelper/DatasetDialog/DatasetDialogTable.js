import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTable } from '~/components';
import { datasetColumns } from './dialogColumns';
import style from '~/assets/jss/pages/DialogStyle';
import { POP_PAGESIZE_OPTIONS, POP_DISPLAY_PAGE_NUM } from '~/constants';
import { getDatasetList } from '~/stores/dataset/datasetAutoStore';

const useStyle = makeStyles(style);

const DatasetDialogTable = ({ onChangeRadio }) => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const { search, list, total, error, loading } = useSelector((store) => ({
        search: store.datasetAutoStore.search,
        list: store.datasetAutoStore.list,
        total: store.datasetAutoStore.total,
        error: store.datasetAutoStore.error,
        loading: store.loadingStore['datasetAutoStore/GET_DATASET_LIST']
    }));
    const [listRows, setListRows] = useState([]);
    const [selected, setSelected] = useState([]); // 라디오 선택목록

    // rows 생성
    useEffect(() => {
        if (list && list !== null) {
            const rows1 = list.map((m) => {
                return {
                    id: String(m.datasetSeq),
                    datasetSeq: m.datasetSeq,
                    datasetName: m.datasetName,
                    autoCreateYn: m.autoCreateYn === 'Y' ? '자동형' : '수동형'
                };
            });
            setListRows(rows1);
        }
    }, [list]);

    // 라디오 버튼 클릭
    const handleRadioClick = useCallback(
        (event, row) => {
            setSelected([row.id]);
            onChangeRadio([row.id]);
        },
        [onChangeRadio]
    );

    // 목록에서 아이템 클릭
    const handleRowClick = useCallback(
        (e, row) => {
            handleRadioClick(e, row);
        },
        [handleRadioClick]
    );

    // 테이블에서 검색옵션 변경하는 경우
    const handleChangeSearchOption = useCallback(
        (payload) => {
            const option = {
                ...search,
                [payload.key]: payload.value
            };
            dispatch(getDatasetList(option));
        },
        [dispatch, search]
    );

    return (
        <div className={classes.table}>
            <WmsTable
                columns={datasetColumns}
                rows={listRows}
                total={total}
                page={search.page}
                size={search.size}
                pageSizes={POP_PAGESIZE_OPTIONS}
                displayPageNum={POP_DISPLAY_PAGE_NUM}
                onRowClick={handleRowClick}
                onChangeSearchOption={handleChangeSearchOption}
                // currentId={String(selectedRow)}
                loading={loading}
                error={error}
                popupPaging
                selected={selected}
                onRowRadioClick={handleRadioClick}
            />
        </div>
    );
};

export default DatasetDialogTable;
