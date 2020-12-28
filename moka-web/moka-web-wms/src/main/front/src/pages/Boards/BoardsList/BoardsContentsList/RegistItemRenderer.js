import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const RegistItemRenderer = ({ regDt, regId }) => {
    return (
        <>
            <Row>
                <Col style={{ marginBottom: '-10px' }}>{regDt}</Col>
            </Row>
            <Row>
                <Col>{regId}</Col>
            </Row>
        </>
    );
};

export default RegistItemRenderer;
