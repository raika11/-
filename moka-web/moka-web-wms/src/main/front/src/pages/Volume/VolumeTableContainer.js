import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { WmsButton, WmsTable } from '~/components';
import { getVolumes, changeSearchOption } from '~/stores/volume/volumeStore';
import volumeColumns from './components/volumeColumns';

const VolumeTableContainer = (props) => {
    const { classes } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const { detail, search, list, total, error, loading } = useSelector((store) => ({
        detail: store.volumeStore.detail,
        list: store.volumeStore.list,
        total: store.volumeStore.total,
        search: store.volumeStore.search,
        error: store.volumeStore.error,
        loading: store.loadingStore['volumeStore/GET_VOLUMES']
    }));
    const [volumeRows, setVolumeRows] = useState([]);

    /**
     * Row 아이템 클릭(조회)
     * @param {*} e 클릭
     * @param {*} row 정보
     */
    const handleRowClick = (e, row) => history.push(row.link);

    /**
     * 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((payload) => dispatch(getVolumes(payload)), [
        dispatch
    ]);

    /**
     * 볼륨 추가 버튼
     */
    const onAddClick = () => history.push('/volume');

    useEffect(() => {
        dispatch(
            getVolumes(
                changeSearchOption({
                    key: 'page',
                    value: 0
                })
            )
        );
    }, [dispatch]);

    useEffect(() => {
        if (list.length > 0) {
            setVolumeRows(
                list.map((v) => ({
                    volumeId: v.volumeId,
                    volumeName: v.volumeName,
                    link: `/volume/${v.volumeId}`
                }))
            );
        }
    }, [list]);

    return (
        <>
            <div className={clsx(classes.volumeButton, classes.mb8)}>
                <WmsButton color="wolf" onClick={onAddClick}>
                    <span>볼륨 추가</span>
                </WmsButton>
            </div>
            <div className={classes.listTable}>
                <WmsTable
                    columns={volumeColumns}
                    rows={volumeRows}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onRowClick={handleRowClick}
                    onChangeSearchOption={handleChangeSearchOption}
                    currentId={detail.volumeId}
                    loading={loading}
                    error={error}
                />
            </div>
        </>
    );
};

export default VolumeTableContainer;
