import React from 'react';
import { MokaWindow } from '@components';
// import PC from './PC.html';

const ArticlePC = ({ onClose }) => {
    return (
        <MokaWindow title="PC미리보기" onClose={onClose}>
            <div>테스트</div>
        </MokaWindow>
    );
};

export default ArticlePC;
