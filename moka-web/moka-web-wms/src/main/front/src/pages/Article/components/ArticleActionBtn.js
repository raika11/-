import React from 'react';
import Button from 'react-bootstrap/Button';

const ArticleActionBtn = ({ data }) => {
    return (
        <React.Fragment>
            <Button size="sm" variant="outline-table-btn" className="mr-1">
                삭제
            </Button>
            <Button size="sm" variant="outline-table-btn" className="mr-1">
                중지
            </Button>
            <Button size="sm" variant="outline-table-btn" className="mr-1">
                FB
            </Button>
        </React.Fragment>
    );
};

export default ArticleActionBtn;
