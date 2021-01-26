import React from 'react';
import { MokaInput, MokaInputLabel } from '@components';
import { Col, Form } from 'react-bootstrap';

const PollDetailCompareTextAnswerComponent = ({ items, hasUrl }) => {
    return (
        <Form.Row className="align-items-center w-100">
            <Col xs={5}>
                <MokaInput as="textarea" className="mb-2" value={items[0].title} placeholder="보기 1(20자 이내로 입력하세요)" inputProps={{ rows: 4 }} />
                {hasUrl && <MokaInput placeholder="url" value={items[0].linkUrl} />}
            </Col>
            <Col xs={2} className="text-center">
                VS
            </Col>
            <Col xs={5}>
                <MokaInput as="textarea" className="mb-2 align-top" value={items[1].title} placeholder="보기 2(20자 이내로 입력하세요)" inputProps={{ rows: 4 }} />
                {hasUrl && <MokaInput placeholder="url" value={items[1].linkUrl} />}
            </Col>
        </Form.Row>
    );
};

export default PollDetailCompareTextAnswerComponent;
