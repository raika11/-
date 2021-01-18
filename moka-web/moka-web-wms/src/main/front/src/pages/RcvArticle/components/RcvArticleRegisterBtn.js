import React from 'react';
import Button from 'react-bootstrap/Button';

const RcvArticleRegisterBtn = ({ data }) => {
    if (data.serviceDaytime) return null;

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <Button variant="outline-table-btn" size="sm" onClick={() => data.handleRegister(data)}>
                등록
            </Button>
        </div>
    );
};

export default RcvArticleRegisterBtn;
