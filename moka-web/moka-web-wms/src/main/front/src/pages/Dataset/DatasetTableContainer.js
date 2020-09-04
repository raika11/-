import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTable, WmsButton } from '~/components';
import { tableColumns, rowHeight, otherHeight } from './components';
import styles from '~/assets/jss/pages/Dataset/DatasetStyle';
import {
    clearDataset,
    getDatasetList,
    getDataset,
    insertDataset
} from '~/stores/dataset/datasetStore';

const useStyles = makeStyles(styles);

const DatasetTableContainer = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { search, list, total, error, loading, latestDatasetSeq } = useSelector(
        ({ datasetStore, loadingStore }) => ({
            search: datasetStore.search,
            list: datasetStore.list,
            total: datasetStore.total,
            error: datasetStore.error,
            loading:
                loadingStore['datasetStore/GET_DATASET_LIST'] ||
                loadingStore['datasetStore/DELETE_DATASET'],
            latestDatasetSeq: datasetStore.latestDatasetSeq
        })
    );
    const [listRows, setListRows] = useState([]);

    useEffect(() => {
        return () => {
            dispatch(clearDataset());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 데이타셋정보 로컬화
    useEffect(() => {
        if (list) {
            setListRows(
                list.map((d) => {
                    return {
                        id: String(d.datasetSeq),
                        datasetSeq: d.datasetSeq,
                        datasetName: d.datasetName,
                        dataApi: d.dataApi,
                        autoCreateYn: d.autoCreateYn === 'Y' ? '자동형' : '수동형',
                        useYn: d.useYn,
                        link: `/dataset/${d.datasetSeq}`
                    };
                })
            );
        }
    }, [list]);

    // row 클릭 콜백
    const handleRowClick = useCallback(
        (e, row) => {
            dispatch(
                getDataset({
                    datasetSeq: row.datasetSeq,
                    callback: (result) => {
                        if (result) history.push(row.link);
                    }
                })
            );
        },
        [dispatch, history]
    );

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
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

    /**
     * 데이타셋추가 클릭 콜백
     */
    const onAddClick = useCallback(() => {
        dispatch(
            insertDataset({
                apiCodeId: search.apiCodeId,
                apiHost: search.apiHost,
                apiPath: search.apiPath
            })
        );
        history.push('/dataset');
    }, [dispatch, history, search]);

    return (
        <>
            <div className={clsx(classes.listTableButtonGroup, classes.mb8)}>
                <div>
                    <WmsButton color="wolf" onClick={onAddClick}>
                        <span>데이타셋 추가</span>
                    </WmsButton>
                </div>
            </div>
            <WmsTable
                columns={tableColumns}
                rows={listRows}
                total={total}
                page={search.page}
                size={search.size}
                onRowClick={handleRowClick}
                onChangeSearchOption={handleChangeSearchOption}
                currentId={String(latestDatasetSeq)}
                loading={loading}
                error={error}
                rowHeight={String(rowHeight)}
                otherHeight={String(otherHeight)}
            />
        </>
    );
};

export default withRouter(DatasetTableContainer);
