import React from 'react';
import Button from 'react-bootstrap/Button';

const RcvArticleRegisterBtn = ({ data }) => {
    if (data.serviceDaytime) return null;

    return (
        <Button variant="outline-table-btn" size="sm">
            등록
        </Button>
    );
};

export default RcvArticleRegisterBtn;
