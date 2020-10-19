import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaSearchInput, MokaInput } from '@components';

/**
 * 예약어 검색
 */
const ReservedSearch = () => {
    return (
        <Form className="mb-10">
            <MokaInput as="select" inputClassName="m-0 mb-2">
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
            <div className="d-flex justify-content-end mb-2">
                <Button variant="dark">예약어추가</Button>
            </div>
        </Form>
    );
};

export default ReservedSearch;
