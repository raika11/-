import React from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';

const QuizSearch = ({ onAdd }) => {
    const handleChangeValue = (e) => {
        console.log(e.target.value);
    };
    return (
        <Form className="pb-2">
            <Form.Row className="mb-2">
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="searchType" value="title" onChange={handleChangeValue}>
                        <option value="title">그룹 제목</option>
                        <option value="grpCd">그룹ID</option>
                    </MokaInput>
                </Col>
                <Col xs={8} className="p-0 pr-2">
                    <MokaSearchInput value="" onChange={handleChangeValue} />
                </Col>
                <Col xs={2} className="d-flex p-0 justify-content-end">
                    <Button variant="positive" onClick={onAdd}>
                        퀴즈등록
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default QuizSearch;
