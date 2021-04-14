import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaTable } from '@/components';
import columnDefs from './NewsLetterTypeResultAgGridColumns';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 > 발송 유형별 AgGrid
 */
const NewsLetterTypeResultAgGrid = ({ match, setDisplay }) => {
    const history = useHistory();
    // const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

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
            history.push(`${match.path}/${row.no}`);
        },
        [history, match.path],
    );

    return (
        <>
            <div className="mb-14 d-flex align-items-end justify-content-between">
                <div className="d-flex">
                    <Button variant="outline-neutral" className="mr-1" onClick={() => setDisplay('agGrid')}>
                        도표
                    </Button>
                    <Button variant="outline-neutral" onClick={() => setDisplay('chart')}>
                        차트
                    </Button>
                </div>
                <div className="d-flex">
                    <Button variant="outline-neutral" className="mr-2" style={{ overflow: 'visible' }}>
                        Excel 다운로드
                    </Button>
                    <MokaInput as="select" disabled>
                        <option value="">20개 보기</option>
                    </MokaInput>
                </div>
            </div>
            <MokaTable
                suppressMultiSort // 다중 정렬 비활성
                className="overflow-hidden flex-fill"
                paginationClassName="justify-content-center"
                columnDefs={columnDefs}
                // rowData={}
                onRowNodeId={(data) => data.no}
                onRowClicked={handleRowClicked}
                loading={loading}
                page={search.page}
                // total={total}
                showTotalString={false}
                pageSizes={false}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </>
    );
};

export default NewsLetterTypeResultAgGrid;
