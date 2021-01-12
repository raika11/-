import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';

const SearchLogOverallStatusHeader = () => {
    return (
        <Form>
            <Form.Row className="mb-2 justify-content-between align-items-center">
                <Col xs={6}>최종 갱신시각 : 2020-11-04 16:41:40</Col>
                <Col xs={6} className="text-right">
                    <Button variant="outline-neutral" className="mr-2">
                        검색어 사전
                    </Button>
                    <Button variant="outline-neutral">엑셀 다운로드</Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default SearchLogOverallStatusHeader;
