import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import WmsButton from '~/components/WmsButtons';
import WmsTable from '~/components/WmsTable';
import { getReserved, clearReserved } from '~/stores/reserved/reservedStore';
import styles from '~/assets/jss/pages/Reserved/ReservedTableStyle';
import { reservedColumns, rowHeight, otherHeight } from './components/reservedColumns';

const useStyles = makeStyles(styles);

const ReservedTableContainer = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        reservedList,
        total,
        // error,
        loading,
        deleteLoading,
        search,
        latestReservedSeq
    } = useSelector(({ reservedStore, loadingStore }) => ({
        loading: loadingStore['reservedStore/GET_RESERVED_LIST'],
        deleteLoading: loadingStore['reservedStore/DELETE_RESERVED'],
        reservedList: reservedStore.reservedList,
        total: reservedStore.total,
        search: reservedStore.search,
        latestReservedSeq: reservedStore.latestReservedSeq
    }));
    const [reservedRows, setReservedRows] = useState([]);

    // Store 예약어정보 -> WmsTable데이터로 변경
    useEffect(() => {
        setReservedRows(
            reservedList.map((r) => ({
                id: String(r.reservedSeq),
                reservedId: r.reservedId,
                domain: r.domain,
                reservedSeq: r.reservedSeq,
                reservedValue: r.reservedValue,
                useYn: r.useYn,
                link: `/reserved/${r.reservedSeq}`
            }))
        );
    }, [reservedList]);

    /**
     * 목록에서 아이템 클릭 (상세 조회)
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleRowClick = (e, row) => {
        history.push(row.link);
        dispatch(getReserved(row.reservedSeq));
    };

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    // const handleChangeSearchOption = useCallback(
    //     (payload) => {
    //         dispatch(getReservedList(payload));
    //     }, // search값도 같이 변경된다.
    //     [dispatch]
    // );

    /**
     * 예약어추가 클릭 콜백
     */
    const onAddClick = useCallback(() => {
        history.push('/reserved');
        dispatch(clearReserved({}));
    }, [dispatch, history]);

    return (
        <>
            <div className={clsx(classes.buttonGroup, classes.mb8)}>
                <div>
                    <WmsButton
                        color="wolf"
                        overrideClassName={classes.m0}
                        onClick={onAddClick}
                        size="long"
                    >
                        <span>예약어 추가</span>
                    </WmsButton>
                </div>
            </div>
            <div className={classes.table}>
                <WmsTable
                    columns={reservedColumns}
                    rows={reservedRows}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onRowClick={handleRowClick}
                    // onChangeSearchOption={handleChangeSearchOption}
                    currentId={String(latestReservedSeq)}
                    loading={loading || deleteLoading}
                    rowHeight={String(rowHeight)}
                    otherHeight={String(otherHeight)}
                />
            </div>
        </>
    );
};

export default withRouter(ReservedTableContainer);
