import React from 'react';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Main from './component/Main';

const NoFrame = ({ children, className }) => {
    return (
        <Main className={clsx('d-flex w-100 justify-content-center', { [className]: className })}>
            <Container className="d-flex flex-column">
                <Row className="h-100">
                    <Col sm="10" md="8" lg="6" className="mx-auto d-table h-100">
                        <div className="d-table-cell align-middle">{children}</div>
                    </Col>
                </Row>
            </Container>
        </Main>
    );
};

export default NoFrame;
