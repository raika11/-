import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import { MokaTable } from '@/components';
import columnDefs from './NewsLetterAgGridColumns';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 목록
 */
const NewsLetterAgGrid = ({ match }) => {
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
        history.push(`${match.path}/${row.no}`);
    }, []);

    return (
        <MokaTable
            suppressMultiSort // 다중 정렬 비활성
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={[
                {
                    no: '1',
                    sendType: '자동',
                    type: '오리지널',
                    newsLetter: '정치 언박싱',
                    startDt: '2021-03-01',
                    recentDt: '2021-03-04',
                    ct: '월/화/수/목',
                    time: '14:00',
                    subscriber: '1301',
                    state: '활성',
                    regDt: '2021-02-14',
                    regMember: '정준영(SSC08)',
                    abYn: 'N',
                },
                {
                    no: '2',
                    sendType: '수동',
                    type: '알림',
                    newsLetter: '폴인 인사이트',
                    startDt: '2021-03-02',
                    recentDt: '2021-03-04',
                    ct: '1개',
                    time: '08:00',
                    subscriber: '548',
                    state: '종료',
                    regDt: '2021-02-16',
                    regMember: '정준영(SSC08)',
                    abYn: 'Y',
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
    );
};

export default NewsLetterAgGrid;
