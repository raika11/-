import React from 'react';
import Button from 'react-bootstrap/Button';

const EtcButtonRenderer = ({ value }) => {
    const handleClickSaveButton = () => {};
    return (
        <>
            <div className="d-flex">
                <div className="d-flex">
                    <Button variant="outline-table-btn" className="mr-1" onClick={handleClickSaveButton}>
                        공유
                    </Button>
                    <Button variant="outline-table-btn" className="mr-1" onClick={handleClickSaveButton}>
                        FB 캐시
                    </Button>
                    <Button variant="outline-table-btn" className="mr-0" onClick={handleClickSaveButton}>
                        기사보기
                    </Button>
                </div>
            </div>
        </>
    );
};

export default EtcButtonRenderer;
