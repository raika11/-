import React from 'react';
import Button from 'react-bootstrap/Button';
import Search from './NewsLetterSendArchiveSearch';
import AgGrid from './NewsLetterSendArchiveAgGrid';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 관리 > 수동 발송 아카이브 목록
 */
const NewsLetterSendArchiveList = ({ match }) => {
    return (
        <>
            <Search match={match} />
            <AgGrid match={match} />
            <div className="mt-2">
                <Button variant="outline-neutral">목록 이동</Button>
            </div>
        </>
    );
};

export default NewsLetterSendArchiveList;
