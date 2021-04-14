import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 목록 검색
 */
const NewsLetterResultSearch = () => {
    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel as="select" label="발송 방법" className="pr-2" disabled>
                        <option>전체</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel as="select" label="유형" disabled>
                        <option>전체</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel as="select" label="발송 상태" className="pr-2" disabled>
                        <option>전체</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={3} className="p-0">
                    <MokaInputLabel as="select" label="A/B TEST" disabled>
                        <option>전체</option>
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            <Form.Row className="mb-2">
                <Col xs={6} className="p-0 pr-2 d-flex">
                    <MokaInputLabel as="none" label="발송일" />
                    <MokaInput as="dateTimePicker" className="mr-1" inputProps={{ timeFormat: null, timeDefault: 'start' }} />
                    <p className="mb-0 mx-2 d-flex align-items-center">~</p>
                    <MokaInput as="dateTimePicker" className="ml-1" inputProps={{ timeFormat: null, timeDefault: 'end' }} />
                </Col>

                <div style={{ width: 50 }} className="mr-1">
                    <Button size="sm" variant="outline-neutral" className="w-100 h-100">
                        1주
                    </Button>
                </div>
                <div style={{ width: 50 }} className="mr-1">
                    <Button size="sm" variant="outline-neutral" className="w-100 h-100">
                        15일
                    </Button>
                </div>
                <div style={{ width: 50 }} className="mr-1">
                    <Button size="sm" variant="outline-neutral" className="w-100 h-100">
                        1개월
                    </Button>
                </div>
                <div style={{ width: 50 }} className="mr-1">
                    <Button size="sm" variant="outline-neutral" className="w-100 h-100">
                        3개월
                    </Button>
                </div>
                <div style={{ width: 50 }} className="mr-1">
                    <Button size="sm" variant="outline-neutral" className="w-100 h-100">
                        6개월
                    </Button>
                </div>
                <div style={{ width: 50 }}>
                    <Button size="sm" variant="outline-neutral" className="w-100 h-100">
                        1년
                    </Button>
                </div>
            </Form.Row>

            <Form.Row>
                <MokaInputLabel as="none" label="뉴스레터 명" />
                <MokaSearchInput className="flex-fill" disabled />
            </Form.Row>
        </Form>
    );
};

export default NewsLetterResultSearch;
