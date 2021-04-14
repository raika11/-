import React, { useState } from 'react';
import Search from './NewsLetterTypeResultSearch';
import AgGrid from './NewsLetterTypeResultAgGrid';
import Chart from './NewsLetterTypeResultChart';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 > 유형별 결과 목록
 */
const NewsLetterTypeResultList = ({ match }) => {
    const [display, setDisplay] = useState('agGrid');

    return (
        <>
            <Search match={match} />
            {display === 'agGrid' && <AgGrid match={match} setDisplay={setDisplay} />}
            {display === 'chart' && <Chart setDisplay={setDisplay} />}
        </>
    );
};

export default NewsLetterTypeResultList;
