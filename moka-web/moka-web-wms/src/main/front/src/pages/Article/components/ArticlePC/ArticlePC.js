import React from 'react';
import { MokaWindow } from '@components';
// import PC from './PC.html';

const ArticlePC = ({ show, onHide }) => {
    return (
        <MokaWindow title="PC미리보기" show={show} onHide={onHide}>
            <div>테스트</div>
        </MokaWindow>
    );
};

export default ArticlePC;
