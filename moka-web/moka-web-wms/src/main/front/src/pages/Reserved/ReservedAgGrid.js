import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { columnDefs } from './ReservedAgGridColumns';
import { MokaTable } from '@components';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { changeSearchOption, clearReserved, getReservedList, initialState } from '@store/reserved';

/**
 * 예약어 AgGrid 컴포넌트
 */
const ReservedAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [search, setSearch] = useState(initialState);
    const { total, list, search: storeSearch, latestReservedSeq, loading } = useSelector((store) => ({
        total: store.reserved.total,
        list: store.reserved.list,
        search: store.reserved.search,
        latestReservedSeq: store.reserved.latestReservedSeq,
        loading: store.loading['reserved/GET_RESERVED_LIST'],
    }));

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getReservedList());
    }, [dispatch]);

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            dispatch(
                getReservedList(
                    changeSearchOption({
                        ...search,
                        [key]: value,
                        page: 0,
                    }),
                ),
            );
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((params) => history.push(`/reserved/${params.reservedSeq}`), [history]);

    /**
     * 예약어 추가 버튼 클릭
     */
    const onAddClick = useCallback(() => {
        history.push('/reserved');
        dispatch(clearReserved());
    }, [dispatch, history]);

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
                rowData={list}
                getRowNodeId={(params) => params.reservedSeq}
                agGridHeight={550}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                selected={String(latestReservedSeq)}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </>
    );
};

export default ReservedAgGrid;
