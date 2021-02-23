import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const GroupChildGroupMemberHeader = ({ onClick }) => {
    return (
        <Container fluid className="p-0 mb-14">
            <Row className="m-0 align-items-center">
                <Col className="p-0">
                    <Button variant="negative" onClick={onClick}>
                        선택 삭제
                    </Button>
                </Col>
                <Col className="p-0">
                    <h5 className="mb-0">현 사용자</h5>
                </Col>
            </Row>
        </Container>
    );
};

export default GroupChildGroupMemberHeader;
