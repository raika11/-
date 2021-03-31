import React from 'react';
import Card from 'react-bootstrap/Card';
import Search from './RunStateSearch';
import AgGrid from './RunStateSearchAgGrid';

/**
 * 스케줄 서버 관리 > 작업 실행상태 목록
 */
const RunStateSearchList = ({ show, match }) => {
    return (
        <div className="h-100">
            <Card.Header>
                <Card.Title as="h2">작업 실행상태 목록</Card.Title>
            </Card.Header>
            <Card.Body className="d-flex flex-column custom-scroll" style={{ height: 600 }}>
                <Search show={show} />
                <AgGrid match={match} />
            </Card.Body>
        </div>
    );
};

export default RunStateSearchList;
