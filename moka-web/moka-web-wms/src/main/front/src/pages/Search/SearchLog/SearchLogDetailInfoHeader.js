import React, { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { MokaInputLabel } from '@components';

const SearchLogDetailInfoHeader = ({ keyword }) => {
    const [type, setType] = useState('date');
    return (
        <Form>
            <Form.Row className="mb-2 align-items-center">
                <Col xs={6}>
                    <MokaInputLabel label="검색어" inputProps={{ disabled: true }} value={keyword} />
                </Col>
                <Col xs={2} className="text-right">
                    <MokaInputLabel
                        as="radio"
                        inputProps={{ custom: true, label: '일자별', checked: type === 'date' }}
                        name="type"
                        id="type-1"
                        value="date"
                        onChange={(e) => {
                            const { name, value } = e.target;
                            setType(value);
                        }}
                    />
                </Col>
                <Col xs={2} className="text-right">
                    <MokaInputLabel
                        as="radio"
                        inputProps={{ custom: true, label: '영역별', checked: type === 'area' }}
                        name="type"
                        id="type-2"
                        value="area"
                        onChange={(e) => {
                            const { name, value } = e.target;
                            setType(value);
                        }}
                    />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default SearchLogDetailInfoHeader;
