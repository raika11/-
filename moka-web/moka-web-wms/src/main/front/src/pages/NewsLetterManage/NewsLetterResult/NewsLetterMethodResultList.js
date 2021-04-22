import React, { useState } from 'react';
import Search from './NewsLetterMethodResultSearch';
import AgGrid from './NewsLetterMethodResultAgGrid';
import Chart from './NewsLetterMethodResultChart';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 > 발송 방법별 경과
 */
const NewsLetterMethodResultList = ({ match }) => {
    const [display, setDisplay] = useState('agGrid');

    return (
        <>
            <Search match={match} />
            {display === 'agGrid' && <AgGrid match={match} setDisplay={setDisplay} />}
            {display === 'chart' && <Chart setDisplay={setDisplay} />}
        </>
    );
};

export default NewsLetterMethodResultList;
