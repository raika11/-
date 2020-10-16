import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { MokaSearchInput } from '@components';

const PageChildTemplateSearch = () => {
    return (
        <Form>
            <Form.Group as={Row} className="mb-10">
                <Form.Control as="select" custom>
                    <option>중앙일보(https://joongang.joins.com/)</option>
                </Form.Control>
            </Form.Group>
            <Form.Group as={Row} className="mb-10">
                <Col xs={7} className="pr-1 pr-0 pl-0">
                    <Form.Control as="select" custom>
                        <option>위치그룹</option>
                    </Form.Control>
                </Col>
                <Col xs={5} className="pl-1 pr-0 pl-0">
                    <Form.Control as="select" custom>
                        <option>사이즈 전체</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-10">
                <Col xs={4} className="pr-1 pr-0 pl-0">
                    <Form.Control as="select" custom>
                        <option>템플릿 전체</option>
                    </Form.Control>
                </Col>
                <Col xs={8} className="pl-1 pr-0 pl-0">
                    <MokaSearchInput />
                </Col>
            </Form.Group>
        </Form>
    );
};

export default PageChildTemplateSearch;
