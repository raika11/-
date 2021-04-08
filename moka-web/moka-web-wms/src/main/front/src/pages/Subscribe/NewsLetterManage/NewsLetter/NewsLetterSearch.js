import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 검색
 */
const NewsLetterSearch = () => {
    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel as="select" label="유형" disabled>
                        <option>전체</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel as="select" label="상태" className="pr-2" disabled>
                        <option>전체</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel as="select" label="발송 방법" className="pr-2" disabled>
                        <option>전체</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel as="select" label="A/B TEST 유무" disabled>
                        <option>전체</option>
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            <Form.Row className="mb-2">
                <Col xs={6} className="p-0 pr-2 d-flex">
                    <MokaInputLabel as="none" label="등록일" />
                    <MokaInput as="dateTimePicker" className="mr-1" inputProps={{ timeFormat: null, timeDefault: 'start' }} />
                    <p className="mb-0 mx-2 d-flex align-items-center">~</p>
                    <MokaInput as="dateTimePicker" className="ml-1" inputProps={{ timeFormat: null, timeDefault: 'end' }} />
                </Col>

                {/* <Col xs={6} className="p-0 d-flex"> */}

                <Button size="sm" variant="outline-neutral" className="mr-1">
                    1주
                </Button>
                <Button size="sm" variant="outline-neutral" className="mr-1">
                    1개월
                </Button>
                <Button size="sm" variant="outline-neutral" className="mr-1">
                    3개월
                </Button>
                <Button size="sm" variant="outline-neutral" className="mr-1">
                    6개월
                </Button>
                <Button size="sm" variant="outline-neutral">
                    1년
                </Button>
                {/* </Col> */}
            </Form.Row>
            <MokaSearchInput disabled />
        </Form>
    );
};

export default NewsLetterSearch;
