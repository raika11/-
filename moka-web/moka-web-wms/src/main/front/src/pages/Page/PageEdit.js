import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaSearchInput, MokaCard } from '@components';

const PageEdit = () => {
    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title="사이트 정보">
            <Form>
                <Form.Group>
                    <Button variant="dark" className="mr-05">
                        W3C
                    </Button>
                    <Button variant="dark" className="mr-05">
                        미리보기
                    </Button>
                    <Button variant="info" className="mr-05">
                        즉시반영
                    </Button>
                    <Button variant="secondary" className="mr-05">
                        전송
                    </Button>
                    <Button variant="secondary" className="mr-05">
                        삭제
                    </Button>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        사용여부
                    </Form.Label>
                    <Col md={9} className="px-0 my-auto">
                        <Form.Check type="switch" id="custom-switch1" label="" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        사이트 ID
                    </Form.Label>
                    <Col md={3} className="px-0">
                        <Form.Control type="text" placeholder="ID" />
                    </Col>
                    <Form.Label column md={6} className="px-0 pl-4">
                        URL /
                    </Form.Label>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        페이지명
                    </Form.Label>
                    <Col md={9} className="px-0">
                        <Form.Control type="text" placeholder="페이지명을 입력하세요" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        서비스명
                    </Form.Label>
                    <Col md={5} className="px-0">
                        <Form.Control type="text" />
                    </Col>
                    <Col md={4} className="px-0 pl-3">
                        <Form.Control as="select" custom>
                            <option>text/html</option>
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        표출명
                    </Form.Label>
                    <Col md={6} className="px-0 pr-2">
                        <Form.Control type="text" />
                    </Col>
                    <Form.Label column md={1} className="px-0">
                        순서
                    </Form.Label>
                    <Col md={2} className="px-0 pl-2">
                        <Form.Control type="text" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        이동URL
                    </Form.Label>
                    <Col md={1} className="px-0 my-auto">
                        <Form.Check type="switch" id="custom-switch2" label="" />
                    </Col>
                    <Col md={8} className="px-0 pl-3">
                        <MokaSearchInput />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        키워드
                    </Form.Label>
                    <Col md={9} className="px-0">
                        <Form.Control type="text" placeholder="키워드를 입력하세요" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        설명
                    </Form.Label>
                    <Col md={9} className="px-0">
                        <Form.Control as="textarea" rows="10" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={4} className="px-0">
                        경로 파라미터명
                    </Form.Label>
                    <Col md={8} className="px-0">
                        <Form.Control type="text" />
                    </Col>
                </Form.Group>
            </Form>
        </MokaCard>
    );
};

export default PageEdit;
