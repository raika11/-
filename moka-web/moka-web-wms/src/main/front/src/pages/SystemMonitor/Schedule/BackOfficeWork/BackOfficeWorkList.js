import React from 'react';
import Card from 'react-bootstrap/Card';
import Search from './BackOfficeWorkSearch';
import AgGrid from './BackOfficeWorkAgGrid';

/**
 * 스케줄 서버 관리 > 백오피스 예약작업 목록
 */
const BackOfficeWorkList = ({ show, match }) => {
    return (
        <>
            <Card.Header>
                <Card.Title as="h2">백오피스 예약작업 목록</Card.Title>
            </Card.Header>
            <Card.Body className="d-flex flex-column custom-scroll" style={{ height: 600 }}>
                <Search show={show} />
                <AgGrid match={match} />
            </Card.Body>
        </>
    );
};

export default BackOfficeWorkList;
