import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const ImageComponent = (props) => {
    return (
        <Container>
            <Row>
                <Col xs={6} md={4}>
                    <Image src="holder.js/171x180" rounded />
                </Col>
                <Col xs={6} md={4}>
                    <Image src="holder.js/171x180" roundedCircle />
                </Col>
                <Col xs={6} md={4}>
                    <Image src="holder.js/171x180" thumbnail />
                </Col>
            </Row>
        </Container>
    );
};

export default ImageComponent;
