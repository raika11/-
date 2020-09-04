import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTable } from '~/components';
import { getDatasetList } from '~/stores/dataset/datasetStore';
import { datasetColumns } from './dialogColumns';
import style from '~/assets/jss/pages/DialogStyle';
import { POP_PAGESIZE_OPTIONS, POP_DISPLAY_PAGE_NUM } from '~/constants';

const useStyle = makeStyles(style);

const DatasetDialogTable = (props) => {
    const { datasetSeq, setDatasetSeq, setDatasetName } = props;
    const classes = useStyle();
    const dispatch = useDispatch();
    const { detail, search, total, datasets, loading, error } = useSelector((store) => ({
        detail: store.componentStore.edit,
        search: store.datasetStore.search,
        total: store.datasetStore.total,
        datasets: store.datasetStore.list,
        loading: store.loadingStore['datasetStore/GET_DATASET_LIST'],
        error: store.datasetStore.error
    }));
    const [datasetRows, setDatasetRows] = useState([]);

    /**
     * 라디오 버튼 클릭
     * @param {object} event 클릭이벤트
     * @param {object} row 클릭한 row에 대한 데이터
     */
    const onRowRadioClick = (event, row) => {
        setDatasetSeq(row.datasetSeq);
        setDatasetName(row.datasetName);
    };

    /**
     * row 클릭 콜백
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleRowClick = (e, row) => {
        // 클릭했을때 컴포넌트의 데이터셋id 변경
        onRowRadioClick(e, row);
    };

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = (payload) => {
        const option = {
            ...search,
            [payload.key]: payload.value
        };
        dispatch(getDatasetList(option));
    };

    // rows 생성
    useEffect(() => {
        if (datasets && datasets !== null) {
            const rows1 = datasets.map((m) => {
                return {
                    id: String(m.datasetSeq),
                    datasetSeq: m.datasetSeq,
                    datasetName: m.datasetName,
                    autoCreateYn: m.autoCreateYn === 'Y' ? '자동형' : '수동형'
                };
            });
            setDatasetRows(rows1);
        }
    }, [datasets]);

    useEffect(() => {
        if (detail.dataType === 'AUTO') {
            setDatasetSeq(String(detail.datasetSeq));
        }
    }, [detail, setDatasetSeq]);

    return (
        <div className={classes.table}>
            <WmsTable
                columns={datasetColumns}
                rows={datasetRows}
                total={total}
                page={search.page}
                size={search.size}
                pageSizes={POP_PAGESIZE_OPTIONS}
                displayPageNum={POP_DISPLAY_PAGE_NUM}
                onRowClick={handleRowClick}
                onChangeSearchOption={handleChangeSearchOption}
                currentId={String(datasetSeq)}
                selected={[String(datasetSeq)]}
                onRowRadioClick={onRowRadioClick}
                loading={loading}
                error={error}
                popupPaging
                borderTop
                borderBottom
            />
        </div>
    );
};

export default DatasetDialogTable;
