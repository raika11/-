import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@/components';
import columnDefs from './IssueAgGridColumns';
import produce from 'immer';

/**
 * 패키지 AgGrid
 */
const IssueAgGrid = ({ searchOptions, rowData, total, onChangeSearchOption, loading }) => {
    const history = useHistory();

    /**
     * 패키지 생성 버튼
     */
    const handleClickAdd = () => {
        history.push('/package/add');
    };

    /**
     * 테이블 검색 옵션 변경
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOptions = (option) => {
        if (onChangeSearchOption instanceof Function) {
            onChangeSearchOption(
                produce(searchOptions, (draft) => {
                    draft[option.key] = option.value;
                }),
            );
        }
    };

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`/package/${row.pkgSeq}`);
        },
        [history],
    );

    return (
        <>
            <div className="mb-2 d-flex align-items-center justify-content-between">
                <p className="mb-0">총 {total}건</p>
                <Button variant="positive" onClick={handleClickAdd}>
                    패키지 생성
                </Button>
            </div>
            <MokaTable
                className="flex-fill overflow-hidden"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(params) => params.pkgSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                page={searchOptions.page}
                size={searchOptions.size}
                onChangeSearchOption={handleChangeSearchOptions}
                showTotalString={false}
                pageSizes={false}
                total={total}
                paginationClassName="justify-content-center"
            />
        </>
    );
};

export default IssueAgGrid;
