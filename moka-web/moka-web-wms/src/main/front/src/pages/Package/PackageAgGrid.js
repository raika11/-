import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@/components';
import columnDefs, { rowData } from './PackageAgGridColumns';

/**
 * 패키지 AgGrid
 */
const PackageAgGrid = () => {
    const history = useHistory();
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

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
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`/package/${row.seqNo}`);
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
                onRowNodeId={(params) => params.containerSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                page={search.page}
                onChangeSearchOption={handleChangeSearchOption}
                showTotalString={false}
                pageSizes={false}
                paginationClassName="justify-content-center"
            />
        </>
    );
};

export default PackageAgGrid;
