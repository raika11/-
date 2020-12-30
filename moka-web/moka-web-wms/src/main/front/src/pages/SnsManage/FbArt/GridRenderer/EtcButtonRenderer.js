import React from 'react';
import Button from 'react-bootstrap/Button';

const EtcButtonRenderer = ({ value }) => {
    return (
        <div className="d-flex align-items-center h-100">
            <Button
                variant="outline-table-btn"
                className="mr-2"
                onClick={() => {
                    window.open(`https://www.facebook.com/sharer.php?u=https://mnews.joins.com/article/${value}`, '', 'width=500,height=500');
                }}
                size="sm"
            >
                공유
            </Button>
            <Button
                variant="outline-table-btn"
                className="mr-2"
                onClick={() => {
                    window.open(`https://developers.facebook.com/tools/debug/?q=https://mnews.joins.com/article/${value}`);
                }}
                size="sm"
            >
                FB 캐시
            </Button>
            <Button
                variant="outline-table-btn"
                onClick={() => {
                    window.open(`https://news.joins.com/article/${value}`);
                }}
                size="sm"
            >
                기사보기
            </Button>
        </div>
    );
};

export default EtcButtonRenderer;
