import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { columnDefs } from './ReservedAgGridColumns';
import { MokaTable } from '@components';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { changeSearchOption, clearReserved, getReservedList } from '@store/reserved';

/**
 * 예약어 AgGrid 컴포넌트
 */
const ReservedAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { total, list, search, reserved, loading } = useSelector((store) => ({
        total: store.reserved.total,
        list: store.reserved.list,
        search: store.reserved.search,
        reserved: store.reserved.reserved,
        loading: store.loading['reserved/GET_RESERVED_LIST'],
    }));

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getReservedList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((reserved) => history.push(`/reserved/${reserved.reservedSeq}`), [history]);

    /**
     * 예약어 추가 버튼 클릭
     */
    const handleClickAdd = useCallback(() => {
        history.push('/reserved');
        dispatch(clearReserved());
    }, [dispatch, history]);

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                <Button variant="dark" onClick={handleClickAdd}>
                    예약어추가
                </Button>
            </div>
            {/* 간단한 Table */}
            <MokaTable
                columnDefs={columnDefs}
                rowData={list}
                getRowNodeId={(reserved) => reserved.reservedSeq}
                agGridHeight={550}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                selected={reserved.reservedSeq}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['delete']}
            />
        </>
    );
};

export default ReservedAgGrid;
