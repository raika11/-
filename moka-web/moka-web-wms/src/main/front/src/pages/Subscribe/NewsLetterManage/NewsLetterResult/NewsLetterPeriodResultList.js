import React, { useState } from 'react';
import Search from './NewsLetterPeriodResultSearch';
import AgGrid from './NewsLetterPeriodResultAgGrid';
import Chart from './NewsLetterPeriodResultChart';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 > 발송 주기별 경과
 */
const NewsLetterPeriodResultList = ({ match }) => {
    const [display, setDisplay] = useState('agGrid');

    return (
        <>
            <Search match={match} />
            {display === 'agGrid' && <AgGrid match={match} setDisplay={setDisplay} />}
            {display === 'chart' && <Chart setDisplay={setDisplay} />}
        </>
    );
};

export default NewsLetterPeriodResultList;
