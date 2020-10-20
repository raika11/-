import React, { useState, useCallback } from 'react';
import { columnDefs, rowData } from './TestAgGridColumns';
import { MokaTable } from '@components';

/**
 * TestAgGrid 목록
 * @param {*} props
 */
const TestAgGrid = (props) => {
    const [total] = useState(rowData.length);
    const [loading] = useState(false);
    const [search] = useState({ page: 0, size: 10 });
    const [selected, setSelected] = useState({});

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록에서 Row클릭
     * @param {object} row 선택된 row데이타
     */
    const handleRowClicked = useCallback((row) => {
        setSelected(row);
    }, []);

    /**
     * Row drag
     * @param {object} event 드래그이벤트
     * @param {object} list 드래그된 이후 목록
     */
    const handleRowDragMove = useCallback((event, list) => {
        console.log(list);
    }, []);

    return (
        <>
            {/* 간단한 Table */}
            <MokaTable
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(params) => params.containerSeq}
                agGridHeight={550}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['append', 'link']}
                selected={selected}
                // dragging
                // onRowDragMove={handleRowDragMove}
            />
            {/* 설정 변경가능한 Table */}
            {/* <div className="ag-theme-moka-grid mb-3" style={{ height: '550px' }}>
                <AgGridReact columnDefs={columnDefs} rowData={rowData} getRowNodeId={(params) => params.containerSeq} immutableData animateRows />
            </div>
            <MokaPagination total={total} page={search.page} size={search.size} onChangeSearchOption={handleChangeSearchOption} /> */}
        </>
    );
};

export default TestAgGrid;
