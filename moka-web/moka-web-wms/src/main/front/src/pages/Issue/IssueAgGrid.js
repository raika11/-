import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@/components';
import columnDefs from './IssueAgGridColumns';
import produce from 'immer';
import { GRID_HEADER_HEIGHT, GRID_ROW_HEIGHT } from '@/style_constants';

/**
 * 패키지 AgGrid
 */
const IssueAgGrid = ({ searchOptions, rowData, total, onChangeSearchOption, loading, selected }) => {
    const history = useHistory();

    /**
     * 패키지 생성 버튼
     */
    const handleClickAdd = () => {
        history.push('/issue/add');
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
     * 테이블 sort 변경
     * @param {object} params instance
     */
    const handleSortChange = (params) => {
        const sortModel = params.api.getSortModel();
        const sort = sortModel[0] ? `${sortModel[0].colId},${sortModel[0].sort}` : searchOptions.sort;
        const search = { ...searchOptions, sort, page: 0 };
        onChangeSearchOption(search);
    };

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`/issue/${row.pkgSeq}`);
        },
        [history],
    );

    return (
        <>
            <div className="mb-2 d-flex align-items-center justify-content-end">
                <Button variant="positive" onClick={handleClickAdd}>
                    등록
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
                selected={selected}
                headerHeight={GRID_HEADER_HEIGHT[1]}
                rowHeight={GRID_ROW_HEIGHT.T[1]}
                onChangeSearchOption={handleChangeSearchOptions}
                onSortChanged={handleSortChange}
                total={total}
                preventRowClickCell={['directLink']}
            />
        </>
    );
};

export default IssueAgGrid;
