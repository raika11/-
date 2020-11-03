import React from 'react';
import { MokaModal } from '@components';

const SearchPageModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal
            size="sm"
            width={350}
            show={show}
            onHide={onHide}
            title="페이지 검색"
            buttons={[{ text: '저장' }, { text: '취소', variant: 'dark' }]}
            footerClassName="d-flex justify-content-center"
            draggable
        >
            TTTT
        </MokaModal>
    );
};

export default SearchPageModal;
