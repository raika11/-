import React from 'react';
import { MokaModal } from '@components';

/**
 * Html 수동 편집 모달 컴포넌트
 */
const HtmlEditModal = (props) => {
    const { show, onHide } = props;

    return <MokaModal title="Html 수동 편집" show={show} onHide={onHide} width={700} draggable />;
};

export default HtmlEditModal;
