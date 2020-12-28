import React, { useEffect, useState, useRef } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button } from 'react-bootstrap';

const AnswerFrom = () => {
    const tempEvent = () => {};

    return (
        <Form className="mb-gutter">
            <Form.Row className="mb-2">
                <Col className="p-0">
                    <MokaInputLabel label="제목" labelWidth={80} className="mb-0" id="boardName" name="boardName" value={null} onChange={(e) => tempEvent(e)} />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0">
                    <MokaInputLabel
                        as="textarea"
                        className="mb-2"
                        labelWidth={108}
                        inputClassName="resize-none"
                        inputProps={{ rows: 6 }}
                        name="remark"
                        value={null}
                        onChange={(e) => tempEvent(e)}
                    />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col xs={7} className="p-0">
                    <MokaInputLabel label="등록자" labelWidth={80} className="mb-0" id="boardName" name="boardName" value={null} onChange={(e) => tempEvent(e)} />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default AnswerFrom;
