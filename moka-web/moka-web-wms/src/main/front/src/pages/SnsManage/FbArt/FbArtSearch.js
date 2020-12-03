import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';

const FbArtSearch = () => {
    const handleSearchReset = () => {
        console.log('handleSearchReset');
    };

    const handleChangeValue = () => {
        console.log('handleChangeValue');
    };

    return (
        <Form>
            <Form.Row className="mb-3">
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select" value="title1" className="m-0" name="type" onChange={handleChangeValue}>
                        <option value="title1">제목</option>
                        <option value="title2">기사ID</option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0 pr-2">
                    <MokaSearchInput name="keyword" placeholder={'검색어를 입력해 주세요.'} value={''} onChange={handleChangeValue} onSearch={handleChangeValue} />
                </Col>
                {/* 초기화 버튼 */}
                <Col xs={1} className="p-0">
                    <Button variant="outline-neutral" onClick={handleSearchReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default FbArtSearch;
