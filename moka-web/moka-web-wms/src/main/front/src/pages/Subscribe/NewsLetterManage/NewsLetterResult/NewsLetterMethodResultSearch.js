import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 > 발송 방법별 검색
 */
const NewsLetterMethodResultSearch = () => {
    return (
        <Form className="mb-14">
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel as="none" label="구분" />
                <Col xs={2} className="p-0 d-flex">
                    <MokaInput as="checkbox" className="mr-2" value="all" id="all" inputProps={{ label: '전체', custom: true }} disabled />
                    <MokaInput as="checkbox" className="mr-2" value="A" id="auto" inputProps={{ label: '자동', custom: true }} disabled />
                    <MokaInput as="checkbox" value="M" id="manual" inputProps={{ label: '수동', custom: true }} disabled />
                </Col>
            </Form.Row>

            <Form.Row className="mb-2">
                <Col xs={3} className="p-0 pr-2 d-flex">
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
                <div style={{ width: 50 }}>
                    <Button variant="searching">검색</Button>
                </div>
            </Form.Row>
        </Form>
    );
};

export default NewsLetterMethodResultSearch;
