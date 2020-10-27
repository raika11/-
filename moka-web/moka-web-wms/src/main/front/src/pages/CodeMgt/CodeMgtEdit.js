import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaSearchInput, MokaInput } from '@components';

const CodeMgtEdit = () => {
    /**
     * 코드 추가 버튼 클릭
     */
    const handleAddClick = {};

    return (
        <>
            <Form.Row className="m-0 mb-2">
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select">
                        <option>코드</option>
                        <option>코드명</option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0 pr-2">
                    <MokaSearchInput />
                </Col>
                <Col xs={1} className="p-0">
                    <Button variant="dark" onClick={handleAddClick}>
                        코드 추가
                    </Button>
                </Col>
            </Form.Row>
            <div>AgGrid</div>
        </>
    );
};

export default CodeMgtEdit;
