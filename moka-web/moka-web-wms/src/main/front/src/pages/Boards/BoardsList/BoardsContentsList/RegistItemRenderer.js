import React from 'react';
import { Row, Col } from 'react-bootstrap';

// 등록자 정보
const RegistItemRenderer = ({ regDt, regName }) => {
    return (
        <>
            <Row>
                <Col style={{ marginBottom: '-10px' }}>{regName}</Col>
            </Row>
            <Row>
                <Col>{regDt}</Col>
            </Row>
        </>
    );
};

export default RegistItemRenderer;
