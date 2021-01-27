import React, { useEffect, useState } from 'react';
import { MokaInput, MokaInputLabel } from '@components';
import { Col, Form } from 'react-bootstrap';
import produce from 'immer';

const PollDetailCompareTextAnswerComponent = ({ items, hasUrl, onChange }) => {
    const [editItems, setEditItems] = useState([
        { title: '', linkUrl: '', imgUrl: null, imgFile: null },
        { title: '', linkUrl: '', imgUrl: null, imgFile: null },
    ]);

    const handleChangeValue = (index, name, value) => {
        const tempItems = [...editItems];
        const changeItems = produce(tempItems, (draft) => {
            draft[index][name] = value;
        });

        setEditItems(changeItems);
        if (onChange instanceof Function) {
            onChange(changeItems);
        }
    };

    useEffect(() => {
        if (items.length === 2) {
            setEditItems(items);
        }
    }, [items]);

    return (
        items.length === 2 && (
            <Form.Row className="align-items-center w-100">
                <Col xs={5}>
                    <MokaInput
                        as="textarea"
                        name="title"
                        className="mb-2"
                        value={editItems[0].title}
                        placeholder="보기 1(20자 이내로 입력하세요)"
                        inputProps={{ rows: 4 }}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(0, name, value);
                        }}
                    />
                    {hasUrl && (
                        <MokaInput
                            name="linkUrl"
                            placeholder="url"
                            value={editItems[0].linkUrl}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(0, name, value);
                            }}
                        />
                    )}
                </Col>
                <Col xs={2} className="text-center">
                    VS
                </Col>
                <Col xs={5}>
                    <MokaInput
                        as="textarea"
                        name="title"
                        className="mb-2 align-top"
                        value={editItems[1].title}
                        placeholder="보기 2(20자 이내로 입력하세요)"
                        inputProps={{ rows: 4 }}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(1, name, value);
                        }}
                    />
                    {hasUrl && (
                        <MokaInput
                            name="linkUrl"
                            placeholder="url"
                            value={editItems[1].linkUrl}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(1, name, value);
                            }}
                        />
                    )}
                </Col>
            </Form.Row>
        )
    );
};

export default PollDetailCompareTextAnswerComponent;
