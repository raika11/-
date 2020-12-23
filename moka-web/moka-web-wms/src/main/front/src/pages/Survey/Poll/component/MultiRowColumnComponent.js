import React from 'react';
import { Col, Row } from 'react-bootstrap';

const MultiRowColumnComponent = ({ values }) => {
    return (
        <>
            {values.map((value, index) => (
                <Row key={index}>
                    <Col xs={12} className="d-flex justify-content-center">
                        {value}
                    </Col>
                </Row>
            ))}
        </>
    );
};

export default MultiRowColumnComponent;
