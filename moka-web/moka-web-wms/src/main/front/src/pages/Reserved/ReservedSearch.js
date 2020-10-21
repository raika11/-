import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInputLabel } from '@components';

/**
 * 예약어 검색
 */
const ReservedSearch = () => {
    return (
        <Form className="mb-10">
            <MokaInputLabel as="select" inputClassName="m-0 mb-2">
                <option>서울시스템</option>
            </MokaInputLabel>
            <Form.Row className="m-0 mb-2">
                <Col xs={5} className="p-0 pr-2">
                    <MokaInputLabel as="select">
                        <option>코드</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={7} className="p-0">
                    <MokaSearchInput />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default ReservedSearch;
