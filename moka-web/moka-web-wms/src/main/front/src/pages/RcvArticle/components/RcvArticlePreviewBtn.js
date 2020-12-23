import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ArticlePreviewModal from '@pages/Article/modals/ArticlePreviewModal';

const RcvArticlePreviewBtn = ({ data }) => {
    const [modalShow, setModalShow] = useState(false);

    return (
        <React.Fragment>
            <Button variant={data.compUrl ? 'table-btn' : 'outline-table-btn'} size="sm" onClick={() => setModalShow(true)}>
                {data.compUrl ? '포토' : '보기'}
            </Button>

            <ArticlePreviewModal show={modalShow} onHide={() => setModalShow(false)} />
        </React.Fragment>
    );
};

export default RcvArticlePreviewBtn;
