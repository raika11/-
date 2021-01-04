import React from 'react';
import Button from 'react-bootstrap/Button';

const ArticleActionBtn = ({ data }) => {
    return (
        <div className="d-flex align-items-center h-100">
            <Button size="sm" variant="outline-table-btn" className="mr-1">
                삭제
            </Button>
            <Button size="sm" variant="outline-table-btn" className="mr-1">
                중지
            </Button>
            <Button size="sm" variant="outline-table-btn" className="mr-1">
                FB
            </Button>
        </div>
    );
};

export default ArticleActionBtn;
