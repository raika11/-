import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaInputLabel } from '@components';
import commonUtil from '@utils/commonUtil';
import produce from 'immer';

const PollDetailBasicTextAnswerComponent = ({ item, index, hasUrl, onChange }) => {
    const [editItem, setEditItem] = useState({ title: '', linkUrl: '' });

    const handleChangeValue = (name, value) => {
        const changeItem = produce(editItem, (draft) => {
            draft[name] = value;
        });

        setEditItem(changeItem);
        if (onChange instanceof Function) {
            onChange(changeItem);
        }
    };

    useEffect(() => {
        setEditItem(item);
    }, [item]);

    return (
        <>
            <Form.Row className="mb-2 align-items-center" key={index}>
                <Col xs={12}>
                    <Form.Row className="mb-2">
                        <Col xs={12}>
                            <MokaInputLabel
                                label={`보기 ${index + 1}`}
                                labelWidth={50}
                                name="title"
                                onChange={(e) => {
                                    const { name, value } = e.target;
                                    handleChangeValue(name, value);
                                }}
                                value={editItem.title}
                                placeholder="보기를 입력해주세요."
                            />
                        </Col>
                    </Form.Row>
                    {hasUrl && (
                        <Form.Row className="mb-2">
                            <Col xs={12}>
                                <MokaInputLabel
                                    label={`url ${index + 1}`}
                                    name="linkUrl"
                                    labelWidth={50}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        handleChangeValue(name, value);
                                    }}
                                    value={editItem.linkUrl}
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
