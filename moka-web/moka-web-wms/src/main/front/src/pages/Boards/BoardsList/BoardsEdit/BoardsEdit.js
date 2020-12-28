import React, { useState, useEffect } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button } from 'react-bootstrap';

import FormControl from './FormControl';

const BoardsEdit = () => {
    const [editState, setEditState] = useState(initialEditState);

    const footerButtonElement = {
        new: [
            { text: '저장', variant: 'positive', onClick: () => tempEvent(), className: 'mr-05' },
            { text: '취소', variant: 'negative', onClick: () => tempEvent(), className: 'mr-05' },
        ],
        modify: [
            { text: '답변', variant: 'negative', onClick: () => tempEvent(), className: 'mr-05' },
            { text: '수정', variant: 'positive', onClick: () => tempEvent(), className: 'mr-05' },
            { text: '삭제', variant: 'negative', onClick: () => tempEvent(), className: 'mr-05' },
            { text: '취소', variant: 'negative', onClick: () => tempEvent(), className: 'mr-05' },
        ],
        answer: [
            { text: '저장', variant: 'positive', onClick: () => tempEvent(), className: 'mr-05' },
            { text: '취소', variant: 'negative', onClick: () => tempEvent(), className: 'mr-05' },
        ],
    };

    const loading = false;
    const tempEvent = () => {};

    return (
        <MokaCard
            width={450}
            title={`${editState.title}`}
            titleClassName="mb-0"
            loading={loading}
            footer
            footerClassName="justify-content-center"
            footerButtons={footerButtonElement.hasOwnProperty(initialEditState.mode) ? footerButtonElement[initialEditState.mode] : []}
        >
            <FormControl formMode={editState.mode} />
        </MokaCard>
    );
};

const initialEditState = {
    mode: 'new',
    title: '게시글 등록',
};

// const initialEditState = {
//     mode: 'modify',
//     title: '게시글 수정',
// };

// const initialEditState = {
//     mode: 'answer',
//     title: '답변 등록',
// };

export default BoardsEdit;
