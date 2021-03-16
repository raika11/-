import React from 'react';
import Card from 'react-bootstrap/Card';
import AgGrid from './RunStateAgGrid';

/**
 * 스케줄 서버 관리 > 작업 실행상태 목록
 */
const RunStateList = () => {
    return (
        <>
            <Card.Header>
                <Card.Title as="h2">작업 실행상태 현황</Card.Title>
            </Card.Header>
            <Card.Body className="d-flex flex-column custom-scroll" style={{ height: 600 }}>
                <AgGrid />
            </Card.Body>
        </>
    );
};

export default RunStateList;
