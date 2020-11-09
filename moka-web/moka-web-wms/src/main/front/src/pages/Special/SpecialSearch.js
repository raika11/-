import React, { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';

const SpecialSearch = () => {
    const [tag, setTag] = useState('all');
    const [type, setType] = useState('title');

    const handleClickAdd = useCallback((e) => {}, []);

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
    };

    const handleSearch = useCallback(() => {}, []);

    return (
        <Form>
            <Form.Row className="mb-3">
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" value="all" className="m-0" name="tag">
                        <option value="all">태그 전체</option>
                    </MokaInput>
                </Col>
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select" value="title" className="m-0" name="type">
                        <option value="title">제목</option>
                    </MokaInput>
                </Col>
                <Col xs={3} className="p-0">
                    <MokaSearchInput className="m-0" placeholder="검색어를 입력하세요" onSearch={handleSearch} />
                </Col>
                <Col xs={6} className="p-0 pr-4 d-flex justify-content-end">
                    <Button variant="dark" onClick={handleClickAdd}>
                        페이지 추가
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default SpecialSearch;
