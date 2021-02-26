import React from 'react';
import { Row, Col } from 'react-bootstrap';

// 등록자 정보
const RegistItemRenderer = ({ regDt, regName }) => {
    return (
        <div className="h-100 d-flex flex-column justify-content-center">
            <Row className="m-0">
                <Col className="p-0">{regName}</Col>
            </Row>
            <Row className="m-0">
                <Col className="p-0">{regDt}</Col>
            </Row>
        </div>
    );
};

export default RegistItemRenderer;
