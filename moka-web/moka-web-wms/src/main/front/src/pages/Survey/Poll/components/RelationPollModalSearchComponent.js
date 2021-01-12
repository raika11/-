import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';

const RelationPollModalSearchComponent = () => {
    const [category, setCategory] = useState('hh');
    const [keyword, setKeyword] = useState('hh');

    return (
        <>
            <Form.Row style={{ border: '1px solid #ddd' }} className="p-2 mb-2">
                <Col xs={4} className="d-flex align-items-center">
                    <Form.Label style={{ width: '100px' }} className="pr-2 mb-0 text-right">
                        분류
                    </Form.Label>
                    <MokaInput as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="hh">hh</option>
                        <option value="aa">aa</option>
                    </MokaInput>
                </Col>
                <Col xs={8} className="d-flex align-items-center">
                    <Form.Label style={{ width: '70px' }} className="pr-2 mb-0 text-right">
                        투표제목
                    </Form.Label>
                    <MokaSearchInput className="flex-fill" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                </Col>
            </Form.Row>
        </>
    );
};

export default RelationPollModalSearchComponent;
