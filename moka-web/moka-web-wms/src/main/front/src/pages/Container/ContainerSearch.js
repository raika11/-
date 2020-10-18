import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput } from '@components';

/**
 * 컨테이너 검색 컴포넌트
 */
const ContainerSearch = () => {
    return (
        <Form className="mb-10">
            <Form.Group className="mb-2">
                <Form.Control as="select" custom>
                    <option>도메인선택</option>
                </Form.Control>
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
                <Col xs={4} className="p-0 pr-2">
                    <Form.Control as="select" custom>
                        <option>컨테이너 검색조건</option>
                    </Form.Control>
                </Col>
                <Col xs={8} className="p-0">
                    <MokaSearchInput />
                </Col>
            </Form.Group>
        </Form>
    );
};

export default ContainerSearch;
