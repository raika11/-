import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 > 유형별 검색
 */
const NewsLetterTypeResultSearch = () => {
    return (
        <Form className="mb-14">
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel as="none" label="구분" />
                <Col xs={3} className="p-0 d-flex">
                    <MokaInput as="checkbox" className="mr-2" value="all" id="all" inputProps={{ label: '전체', custom: true }} disabled />
                    <MokaInput as="checkbox" className="mr-2" value="O" id="auto" inputProps={{ label: '오리지널', custom: true }} disabled />
                    <MokaInput as="checkbox" className="mr-2" value="B" id="briefing" inputProps={{ label: '브리핑', custom: true }} disabled />
                    <MokaInput as="checkbox" className="mr-2" value="N" id="notice" inputProps={{ label: '알림', custom: true }} disabled />
                    <MokaInput as="checkbox" value="E" id="etc" inputProps={{ label: '기타', custom: true }} disabled />
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

export default NewsLetterTypeResultSearch;
