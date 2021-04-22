import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@/components';
import columnDefs from './NewsLetterResultAgGridColumns';
import { GRID_HEADER_HEIGHT } from '@/style_constants';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 AgGrid
 */
const NewsLetterResultAgGrid = ({ match }) => {
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
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`${match.path}/${row.no}`);
        },
        [history, match.path],
    );

    return (
        <>
            <div className="mb-14 d-flex align-items-end justify-content-between">
                <p className="mb-0">
                    발송 성공 건수 {total}건(00%) / 오픈 건수 {total}건(00%) / 클릭 건수 {total}건(00%)
                </p>
                <Button variant="outline-neutral">Excel 다운로드</Button>
            </div>

            <MokaTable
                suppressMultiSort // 다중 정렬 비활성
                headerHeight={GRID_HEADER_HEIGHT[1]}
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={[
                    {
                        no: '1',
                        type: '오리지널',
                        newsLetter: '테스트',
                        title: '제목',
                        sendDt: '2021-03-22 10:00',
                        sendTotal: '4',
                        successRate: '-',
                        openRate: '-',
                        clickRate: '-',
                        state: '예약',
                        ab: 'N',
                    },
                    {
                        no: '2',
                        type: '알림',
                        newsLetter: '테스트',
                        title: '제목',
                        sendDt: '2021-03-20 10:00',
                        sendTotal: '1',
                        successRate: '-',
                        openRate: '-',
                        clickRate: '-',
                        state: '발송중',
                        ab: 'N',
                    },
                ]}
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

export default NewsLetterResultAgGrid;
