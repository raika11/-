import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from './DomainAgGridColumns';
import React, { useCallback, useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { rowData } from '@pages/Page/relations/PageChildContainerAgGridColumns';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeSearchOption, getDomains } from '@store/domain';
import { useHistory } from 'react-router-dom';

/**
 * <pre>
 *
 * 2020-10-14 thkim 최초생성
 * </pre>
 *
 * @since 2020-10-14 오후 2:32
 * @author thkim
 */
const DomainAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { detail, list, total, search, error, loading, latestMediaId } = useSelector(
        (store) => ({
            detail: store.domain.detail,
            list: store.domain.list,
            total: store.domain.total,
            search: store.domain.search,
            error: store.domain.error,
            latestMediaId: store.auth.latestMediaId,
        }),
        shallowEqual,
    );

    const onRowClicked = (row) => {
        history.push('/domain/' + row.domainId);
    };

    useEffect(() => {
        dispatch(
            getDomains(
                changeSearchOption({
                    key: 'mediaId',
                    value: latestMediaId,
                }),
            ),
        );
    }, [latestMediaId, dispatch]);
    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => {
        dispatch(changeSearchOption(search));
    }, []);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((params) => console.log(params), []);

    return (
        <>
            {/*<div className="ag-theme-moka-grid">
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    getRowNodeId={(params) => params.containerSeq}
                    immutableData
                    animateRows
                    onRowClicked={onRowClicked}
                    onCellClicked={(cellData) => {
                        console.log(cellData);
                    }}
                />
            </div>*/}
            {/* 간단한 Table */}
            <MokaTable
                columnDefs={columnDefs}
                rowData={list}
                onRowNodeId={(params) => (params.containerSeq ? params.containerSeq : 0)}
                agGridHeight={600}
                onRowClicked={onRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
            />
            {/* 설정 변경가능한 Table */}
            {/* <div className="ag-theme-moka-grid mb-3" style={{ height: '550px' }}>
                <AgGridReact columnDefs={columnDefs} rowData={rowData} getRowNodeId={(params) => params.containerSeq} immutableData animateRows />
            </div>
            <MokaPagination total={total} page={search.page} size={search.size} onChangeSearchOption={handleChangeSearchOption} /> */}
        </>
    );
};

export default DomainAgGrid;
