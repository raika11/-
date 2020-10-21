import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaSearchInput, MokaInputLabel } from '@components';

/**
 * 데이터셋 검색 컴포넌트
 */
const DatasetSearch = () => {
    return (
        <Form className="mb-10">
            <Form.Row className="m-0 mb-2">
                <Col xs={8} className="p-0 pr-2">
                    <MokaInputLabel as="select">
                        <option>API선택</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={4} className="p-0">
                    <MokaInputLabel as="select">
                        <option>데이터 전체</option>
                    </MokaInputLabel>
                </Col>
            </Form.Row>
            <Form.Row className="m-0 mb-2">
                <Col xs={5} className="p-0 pr-2">
                    <MokaInputLabel as="select">
                        <option>데이터셋 전체</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={7} className="p-0">
                    <MokaSearchInput />
                </Col>
            </Form.Row>
            <div className="d-flex justify-content-end mb-2">
                <Button variant="dark">데이터셋 추가</Button>
            </div>
        </Form>
    );
};

export default DatasetSearch;
