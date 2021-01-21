import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaInputLabel } from '@components';
import commonUtil from '@utils/commonUtil';

const PollDetailBasicTextAnswerComponent = ({ item, index, hasUrl }) => {
    return (
        <>
            <Form.Row style={{ alignItems: 'center' }} className="mb-2" key={index}>
                <Col className="flex-fill">
                    <Form.Row className="mb-2">
                        <Col xs={12}>
                            <MokaInputLabel
                                label={`보기 ${index + 1}`}
                                labelWidth={50}
                                onChange={(e) => {
                                    //setValue1(e.target.value);
                                }}
                                value={item.title}
                                placeholder="보기를 입력해주세요."
                            />
                        </Col>
                    </Form.Row>
                    {(hasUrl || !commonUtil.isEmpty(item.linkUrl)) && (
                        <Form.Row className="mb-2">
                            <Col xs={12}>
                                <MokaInputLabel
                                    label={`url ${index + 1}`}
                                    labelWidth={35}
                                    onChange={(e) => {
                                        //setValue2(e.target.value);
                                    }}
                                    value={item.linkUrl}
                                    placeholder="url을 입력해주세요"
                                />
                            </Col>
                        </Form.Row>
                    )}
                </Col>
            </Form.Row>
        </>
    );
};

export default PollDetailBasicTextAnswerComponent;
