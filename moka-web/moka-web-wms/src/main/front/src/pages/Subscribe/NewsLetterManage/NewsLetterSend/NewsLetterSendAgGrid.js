import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@/components';
import columnDefs from './NewsLetterSendAgGridColumns';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 목록
 */
const NewsLetterSendAgGrid = ({ match }) => {
    const history = useHistory();
    const [total] = useState(0);
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
    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    /**
     * 뉴스레터 등록
     */
    const handleClickAdd = () => {
        history.push(`${match.path}/add`);
    };

    return (
        <>
            <div className="mb-14 d-flex justify-content-end">
                <Button variant="positive" className="mr-1" onClick={handleClickAdd}>
                    뉴스레터 등록
                </Button>
                <Button variant="outline-neutral" className="mr-1">
                    아카이브 확인
                </Button>
                <Button variant="outline-neutral">Excel 다운로드</Button>
            </div>
            <MokaTable
                suppressMultiSort // 다중 정렬 비활성
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                onRowNodeId={(data) => data.no}
                onRowClicked={handleRowClicked}
                loading={loading}
                page={search.page}
                size={search.size}
                total={total}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </>
    );
};

export default NewsLetterSendAgGrid;
