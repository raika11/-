import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInput } from '@components';

/**
 * 예약어 검색
 */
const ReservedSearch = () => {
    return (
        <Form className="mb-10">
            <MokaInput as="select" className="m-0 mb-2">
                <option>서울시스템</option>
            </MokaInput>
            <Form.Row className="m-0 mb-2">
                <Col xs={5} className="p-0 pr-2">
                    <MokaInput as="select">
                        <option>코드</option>
                    </MokaInput>
                </Col>
                <Col xs={7} className="p-0">
                    <MokaSearchInput />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default ReservedSearch;
