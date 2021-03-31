import React from 'react';
import Card from 'react-bootstrap/Card';
import Search from './WorkSearch';
import AgGrid from './WorkAgGrid';

/**
 * 스케줄 서버 관리 > 작업 목록
 */
const WorkList = ({ show, match }) => {
    return (
        <>
            <Card.Header>
                <Card.Title as="h2">작업 목록</Card.Title>
            </Card.Header>
            <Card.Body className="d-flex flex-column custom-scroll" style={{ height: 600 }}>
                <Search show={show} match={match} />
                <AgGrid match={match} />
            </Card.Body>
        </>
    );
};

export default WorkList;
