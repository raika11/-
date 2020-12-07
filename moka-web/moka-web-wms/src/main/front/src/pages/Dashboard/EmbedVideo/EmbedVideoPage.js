import React from 'react';
import EmbedVideoComponent from './EmbedVideoComponent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const EmbedVideoPage = () => {
    return (
        <Container fluid className="p-0">
            <h1 className="h3 mb-3">Embed Video</h1>

            <Row>
                <Col md="6">
                    <EmbedVideoComponent title="21:9 VIDEO" subtitle="21:9 ratio" ratio="21by9" link="https://www.youtube.com/embed/Rt0oX-4Hbxc?autohide=0&showinfo=0&controls=0" />
                </Col>
                <Col md="6">
                    <EmbedVideoComponent title="16:9 VIDEO" subtitle="16:9 ratio" ratio="16by9" link="https://www.youtube.com/embed/Rt0oX-4Hbxc?autohide=0&showinfo=0&controls=0" />
                </Col>
                <Col md="6">
                    <EmbedVideoComponent title="1:1 VIDEO" subtitle="1:1 ratio" ratio="1by1" link="https://www.youtube.com/embed/Rt0oX-4Hbxc?autohide=0&showinfo=0&controls=0" />
                </Col>
                <Col md="6">
                    <EmbedVideoComponent title="4:3 VIDEO" subtitle="4:3 ratio" ratio="4by3" link="https://www.youtube.com/embed/Rt0oX-4Hbxc?autohide=0&showinfo=0&controls=0" />
                </Col>
            </Row>
        </Container>
    );
};
export default EmbedVideoPage;
