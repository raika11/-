import React from 'react';
import { MokaCard, MokaInput, MokaInputLabel } from '@components';
import { Form, Row, Col } from 'react-bootstrap';

const PollEdit = () => {
    return (
        <MokaCard title="투표 등록" className="flex-fill">
            <Form>
                <Form.Row>
                    <Col xs={3}>
                        <MokaInputLabel as="switch" label="메인노출" labelWidth={70} labelClassName="text-right" />
                    </Col>
                </Form.Row>
                <Form.Row className="justify-content-between">
                    <Col xs={6}>
                        <MokaInputLabel as="select" label="그룹" labelWidth={70} labelClassName="text-right">
                            <option>관리자</option>
                        </MokaInputLabel>
                    </Col>
                    <Col xs={6}>
                        <MokaInputLabel as="select" label="분류" labelWidth={50} labelClassName="text-right">
                            <option>관리자</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <Form.Row className="justify-content-between">
                    <Col xs={6}>
                        <MokaInputLabel as="select" label="그래프 타입" labelWidth={70} labelClassName="text-right">
                            <option>관리자</option>
                        </MokaInputLabel>
                    </Col>
                    <Col xs={6}>
                        <MokaInputLabel as="select" label="레이아웃" labelWidth={50} labelClassName="text-right">
                            <option>관리자</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={7}>
                        <MokaInputLabel as="dateTimePicker" label="투표기간" labelWidth={70} labelClassName="text-right" />
                    </Col>
                    <span>~</span>
                    <Col xs={5}>
                        <MokaInput as="dateTimePicker" />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel as="select" label="서비스 상태" labelWidth={70} labelClassName="text-right">
                            <option>서비스 중</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={3}>
                        <MokaInputLabel as="switch" label="메인노출" labelWidth={70} labelClassName="text-right" onChange={() => console.log('h1')} />
                    </Col>
                    <Col xs={3}>
                        <MokaInputLabel as="switch" label="중복 투표 제한" labelWidth={85} labelClassName="text-right mr-1" onChange={() => console.log('h2')} />
                    </Col>
                    <Col xs={3}>
                        <MokaInputLabel as="switch" label="나도 한마디" labelWidth={70} labelClassName="text-right" onChange={() => console.log('h3')} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={3}>
                        <MokaInputLabel as="switch" label="게시판" labelWidth={70} labelClassName="text-right" onChange={() => console.log('h1')} />
                    </Col>
                    <Col xs={6}>
                        <MokaInputLabel label="url" labelWidth={35} labelClassName="text-right" onChange={() => console.log('h2')} />
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default PollEdit;
