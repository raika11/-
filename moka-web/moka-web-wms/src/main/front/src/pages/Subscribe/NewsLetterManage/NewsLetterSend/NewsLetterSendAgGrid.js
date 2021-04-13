import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaTable } from '@/components';
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
     * 뉴스레터 발송
     */
    const handleClickAdd = () => {
        history.push(`${match.path}/add`);
    };

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

    return (
        <>
            <div className="mb-14 d-flex align-items-end justify-content-between">
                <p className="mb-0">전체 상품 {total}개</p>
                <div className="d-flex">
                    <Button variant="positive" className="mr-1" style={{ overflow: 'visible' }} onClick={handleClickAdd}>
                        뉴스레터 발송
                    </Button>
                    <Button variant="outline-neutral" className="mr-1" style={{ overflow: 'visible' }}>
                        아카이브 확인
                    </Button>
                    <Button variant="outline-neutral" className="mr-2" style={{ overflow: 'visible' }}>
                        Excel 다운로드
                    </Button>
                    <MokaInput as="select" disabled>
                        <option value="">20개 보기</option>
                    </MokaInput>
                </div>
            </div>

            <MokaTable
                className="overflow-hidden flex-fill"
                paginationClassName="justify-content-center"
                columnDefs={columnDefs}
                onRowNodeId={(data) => data.seq}
                onRowClicked={handleRowClicked}
                loading={loading}
                page={search.page}
                pageSizes={false}
                showTotalString={false}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </>
    );
};

export default NewsLetterSendAgGrid;
