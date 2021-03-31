import React from 'react';
import Card from 'react-bootstrap/Card';
import Search from './DeleteWorkSearch';
import AgGrid from './DeleteWorkAgGrid';

/**
 * 스케줄 서버 관리 > 삭제 작업 목록
 */
const DeleteWorkList = ({ show, match }) => {
    return (
        <>
            <Card.Header>
                <Card.Title as="h2">삭제 작업 목록</Card.Title>
            </Card.Header>
            <Card.Body className="d-flex flex-column custom-scroll" style={{ height: 600 }}>
                <Search show={show} />
                <AgGrid match={match} />
            </Card.Body>
        </>
    );
};

export default DeleteWorkList;
