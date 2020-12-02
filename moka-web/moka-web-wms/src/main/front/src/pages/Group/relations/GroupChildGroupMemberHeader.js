import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const GroupChildGroupMemberHeader = ({ onClick }) => {
    return (
        <Row style={{ marginLeft: 0, marginRight: 0 }}>
            <Col xs={4} className="p-0 pr-2">
                <div className="mb-3 d-flex align-items-center">
                    <Button variant="dark" onClick={onClick}>
                        선택 삭제
                    </Button>
                </div>
            </Col>
            <Col xs={4} className="d-flex justify-content-center align-items-center">
                <h5>현 사용자</h5>
            </Col>
        </Row>
    );
};

export default GroupChildGroupMemberHeader;
