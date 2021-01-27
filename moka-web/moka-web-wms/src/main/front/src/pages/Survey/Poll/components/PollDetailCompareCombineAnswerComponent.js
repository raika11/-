import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';
import { MokaInput } from '@components';
import produce from 'immer';

const PollDetailCompareCombineAnswerComponent = ({ items, hasUrl, onChange }) => {
    const handleChangeValue = (index, name, value, type) => {
        if (onChange instanceof Function) {
            onChange(index, name, value);
        }
    };
    return (
        <Form.Row className="text-center align-items-center w-100">
            <Col xs={5}>
                <PollPhotoComponent
                    width={110}
                    height={110}
                    src={items[0].imgUrl}
                    onChange={(file) => {
                        handleChangeValue(0, 'imgFile', file, 'file');
                    }}
                >
                    150 x 150
                </PollPhotoComponent>
                <MokaInput
                    name="title"
                    value={items[0].title}
                    placeholder="보기 1(20자 이내로 입력하세요.)"
                    onChange={(e) => {
                        const { name, value, type } = e.target;
                        handleChangeValue(0, name, value, type);
                    }}
                />
                {(hasUrl || items[0].linkUrl) && (
                    <MokaInput
                        name="linkUrl"
                        placeholder="url"
                        value={items[0].linkUrl}
                        onChange={(e) => {
                            const { name, value, type } = e.target;
                            handleChangeValue(0, name, value, type);
                        }}
                    />
                )}
            </Col>
            <Col xs={2} className="text-center">
                VS
            </Col>
            <Col xs={5}>
                <PollPhotoComponent
                    width={110}
                    height={110}
                    src={items[1].imgUrl}
                    onChange={(file) => {
                        handleChangeValue(1, 'imgFile', file, 'file');
                    }}
                >
                    150 x 150
                </PollPhotoComponent>
                <MokaInput
                    name="title"
                    value={items[1].title}
                    placeholder="보기 2(20자 이내로 입력하세요.)"
                    onChange={(e) => {
                        const { name, value, type } = e.target;
                        handleChangeValue(1, name, value, type);
                    }}
                />
                {(hasUrl || items[1].linkUrl) && (
                    <MokaInput
                        name="linkUrl"
                        placeholder="url"
                        value={items[1].linkUrl}
                        onChange={(e) => {
                            const { name, value, type } = e.target;
                            handleChangeValue(1, name, value, type);
                        }}
                    />
                )}
            </Col>
        </Form.Row>
    );
};

export default PollDetailCompareCombineAnswerComponent;
