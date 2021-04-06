import React from 'react';
import Form from 'react-bootstrap/Form';
import { MokaIcon } from '@components';

const ABStatusRow = () => {
    return (
        <Form.Row className="mb-2 align-items-center">
            <MokaIcon iconName="fas-circle" fixedWidth className="color-neutral mr-2" />
            <span className="mr-32">대기</span>
            <span>수정일시</span>
        </Form.Row>
    );
};

export default ABStatusRow;
