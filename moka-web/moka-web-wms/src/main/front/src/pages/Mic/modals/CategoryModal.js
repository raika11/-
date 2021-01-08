import React from 'react';
import { MokaModal } from '@/components';

const CategoryModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal title="카테고리 관리" show={show} onHide={onHide} size="sm">
            test
        </MokaModal>
    );
};

export default CategoryModal;
