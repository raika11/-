import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 > 발송 주기별(요일) 검색
 */
const NewsLetterPeriodResultSearch = () => {
    return (
        <Form className="mb-14">
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel as="none" label="구분" />
                <Col xs={6} className="p-0 d-flex">
                    <MokaInput as="checkbox" className="mr-2" value="all" id="all" inputProps={{ label: '전체', custom: true }} disabled />
                    <MokaInput as="checkbox" className="mr-2" value="monday" id="monday" inputProps={{ label: '월', custom: true }} disabled />
                    <MokaInput as="checkbox" className="mr-2" value="tuesday" id="tuesday" inputProps={{ label: '화', custom: true }} disabled />
                    <MokaInput as="checkbox" className="mr-2" value="wednesday" id="wednesday" inputProps={{ label: '수', custom: true }} disabled />
                    <MokaInput as="checkbox" className="mr-2" value="thursday" id="thursday" inputProps={{ label: '목', custom: true }} disabled />
                    <MokaInput as="checkbox" className="mr-2" value="friday" id="friday" inputProps={{ label: '금', custom: true }} disabled />
                    <MokaInput as="checkbox" className="mr-2" value="saturday" id="saturday" inputProps={{ label: '토', custom: true }} disabled />
                    <MokaInput as="checkbox" value="sunday" id="sunday" inputProps={{ label: '일', custom: true }} disabled />
                </Col>
            </Form.Row>

            <Form.Row className="mb-2">
                <Col xs={3} className="p-0 pr-2 d-flex">
                    <MokaInputLabel as="none" label="기간" />
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

export default NewsLetterPeriodResultSearch;
