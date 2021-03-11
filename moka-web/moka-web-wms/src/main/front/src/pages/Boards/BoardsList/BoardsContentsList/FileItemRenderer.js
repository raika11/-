import React from 'react';
import { Col } from 'react-bootstrap';
import { MokaIcon } from '@components';

// 그리드 목록에서 파일 첨부가 되었을떄 파일 아이콘을 보여줌.
const FileItemRenderer = (props) => {
    return (
        <>
            <Col style={{ marginTop: '5px' }}>{props.value.attaches.length > 0 && <MokaIcon iconName="fal-copy" />}</Col>
        </>
    );
};

export default FileItemRenderer;
