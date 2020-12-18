import React from 'react';
import Button from 'react-bootstrap/Button';

const EtcButtonRenderer = ({ value }) => {
    const handleClickSaveButton = () => {};
    return (
        <>
            <div className="d-flex">
                <div className="d-flex">
                    <Button
                        variant="outline-table-btn"
                        className="mr-1"
                        onClick={() => {
                            window.open(`https://www.facebook.com/sharer.php?u=https://mnews.joins.com/article/${value}`, '', 'width=500,height=500');
                        }}
                    >
                        공유
                    </Button>
                    <Button
                        variant="outline-table-btn"
                        className="mr-1"
                        onClick={() => {
                            window.open(`https://developers.facebook.com/tools/debug/?q=https://mnews.joins.com/article/${value}`);
                        }}
                    >
                        FB 캐시
                    </Button>
                    <Button
                        variant="outline-table-btn"
                        className="mr-0"
                        onClick={() => {
                            window.open(`https://news.joins.com/article/${value}`);
                        }}
                    >
                        기사보기
                    </Button>
                </div>
            </div>
        </>
    );
};

export default EtcButtonRenderer;
