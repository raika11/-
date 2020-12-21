import React from 'react';
import Button from 'react-bootstrap/Button';

const RcvArticlePreviewBtn = ({ data }) => {
    return (
        <Button variant={data.photo === 'Y' ? 'table-btn' : 'outline-table-btn'} size="sm">
            {data.photo === 'Y' ? '포토' : '보기'}
        </Button>
    );
};

export default RcvArticlePreviewBtn;
