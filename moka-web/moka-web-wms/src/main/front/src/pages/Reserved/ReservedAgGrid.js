import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { columnDefs } from './ReservedAgGridColumns';
import { MokaTable } from '@components';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { changeSearchOption, getReservedList, clearReserved } from '@store/reserved';

/**
 * 예약어 AgGrid 컴포넌트
 */
const ReservedAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { total, list, search, reserved, latestReservedSeq, loading } = useSelector((store) => ({
        total: store.reserved.total,
        list: store.reserved.list,
        search: store.reserved.search,
        reserved: store.reserved.reserved,
        latestReservedSeq: store.reserved.latestReservedSeq,
    }));
    const [reservedRows, setReservedRows] = useState([]);

    /**
     * Store의 예약어 정보를 테이블 데이터로 변경
     */
    useEffect(() => {
        setReservedRows(
            list.map((r) => ({
                id: String(r.reservedSeq),
                reservedId: r.reservedId,
                domain: r.domain,
                reservedSeq: r.reservedSeq,
                reservedValue: r.reservedValue,
                useYn: r.useYn,
                link: `/reserved/${r.reservedSeq}`,
            })),
        );
    }, [list]);

    /**
     * 예약어 추가 e
     */
    const onAddClick = useCallback(() => {
        history.push('/reserved');
        dispatch(clearReserved());
    }, [dispatch, history]);

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        (search) => {
            dispatch(getReservedList(changeSearchOption(search), search.key === 'size' && changeSearchOption({ key: 'page', value: 0 })));
        },
        [dispatch],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (e, row) => {
            history.push(row.link);
        },
        [history],
    );

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                <Button variant="dark" onClick={onAddClick}>
                    예약어추가
                </Button>
            </div>
            {/* 간단한 Table */}
            <MokaTable
                columnDefs={columnDefs}
                // 수정중
                rowData={total}
                getRowNodeId={(params) => params.reservedId}
                agGridHeight={550}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </>
    );
};

export default ReservedAgGrid;
