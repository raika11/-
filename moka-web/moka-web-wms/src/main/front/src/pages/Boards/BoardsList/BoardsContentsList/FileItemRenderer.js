import React from 'react';
import { Col } from 'react-bootstrap';
import { MokaIcon } from '@components';

const FileItemRenderer = ({ fileYn, file }) => {
    return (
        <>
            <Col style={{ marginTop: '5px' }}>
                <MokaIcon iconName="fal-copy" />
            </Col>
        </>
    );
};

export default FileItemRenderer;
