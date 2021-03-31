import React from 'react';
import Card from 'react-bootstrap/Card';
import Search from './DeployServerSearch';
import AgGrid from './DeployServerAgGrid';

/**
 * 스케줄 서버 관리 > 배포 서버 관리 목록
 */
const DeployServerList = ({ show, match }) => {
    return (
        <>
            <Card.Header>
                <Card.Title as="h2">배포 서버 목록</Card.Title>
            </Card.Header>
            <Card.Body className="d-flex flex-column custom-scroll" style={{ height: 600 }}>
                <Search show={show} match={match} />
                <AgGrid match={match} />
            </Card.Body>
        </>
    );
};

export default DeployServerList;
