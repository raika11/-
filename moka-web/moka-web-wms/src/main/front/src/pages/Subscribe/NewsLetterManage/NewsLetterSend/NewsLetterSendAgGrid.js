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
     * 뉴스레터 발송
     */
    const handleClickSend = () => {
        history.push(`${match.path}/send`);
    };

    return (
        <>
            <div className="mb-14 d-flex justify-content-end">
                <Button variant="positive" className="mr-1" onClick={handleClickSend}>
                    뉴스레터 발송
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
                rowData={[
                    {
                        no: '1',
                        letterType: '오리지널',
                        letterName: '정치 언박싱',
                        letterTitle: '[정치 언박싱] 지지후보 바꿀수도...',
                        sendDt: '2021-03-01',
                        abtestYn: 'N',
                    },
                    {
                        no: '2',
                        letterType: '알림',
                        letterName: '폴인 인사이트',
                        letterTitle: "[폴인 인사이트] '초통령' 로블록스, 졸업 할 수 있을까",
                        sendDt: '2021-03-02',
                        abtestYn: 'Y',
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

export default NewsLetterSendAgGrid;
