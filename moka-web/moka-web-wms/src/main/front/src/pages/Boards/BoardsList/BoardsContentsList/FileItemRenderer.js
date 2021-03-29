import React from 'react';
import { MokaIcon } from '@components';

/**
 * 파일 첨부가 되었을떄 파일 아이콘
 */
const FileItemRenderer = (props) => {
    return <div className="h-100 d-flex align-items-center justify-content-center">{props.value.attaches.length > 0 && <MokaIcon iconName="fal-copy" />}</div>;
};

export default FileItemRenderer;
