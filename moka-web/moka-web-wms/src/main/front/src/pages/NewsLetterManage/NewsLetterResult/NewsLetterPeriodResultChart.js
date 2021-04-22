import React from 'react';
import Button from 'react-bootstrap/Button';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 > 발송 주기별 chart
 */
const NewsLetterPeriodResultChart = ({ setDisplay }) => {
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
                    <Button variant="outline-neutral">Excel 다운로드</Button>
                </div>
            </div>
            <p>차트 구현 예정</p>
        </>
    );
};

export default NewsLetterPeriodResultChart;
