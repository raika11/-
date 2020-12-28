import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const TitleItemRenderer = ({ title, usedYn }) => {
    return (
        <>
            {usedYn === 'Y' ? (
                <Row>
                    <Col>{title}</Col>
                </Row>
            ) : (
                <Row>
                    <Col>
                        <div style={{ color: '#a0a0a0' }}>{title}</div>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default TitleItemRenderer;
