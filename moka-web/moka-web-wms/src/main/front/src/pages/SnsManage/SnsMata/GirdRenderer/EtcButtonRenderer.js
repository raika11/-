import React from 'react';
import Button from 'react-bootstrap/Button';

const EtcButtonRenderer = (params) => {
    const handleClickSaveButton = () => {
        console.log('::: handleClickSaveButton ::');
    };
    return (
        <div className="d-flex py-2">
            <div className="d-flex py-2">
                <div className="justify-content-between mr-3 p-1">
                    <Button variant="negative" className="mr-05" onClick={handleClickSaveButton}>
                        전송
                    </Button>
                </div>
                <div className="justify-content-between mr-3 p-1">
                    <Button variant="negative" className="mr-05" onClick={handleClickSaveButton}>
                        FB캐시
                    </Button>
                </div>
                <div className="justify-content-between mr-3 p-1">
                    <Button variant="negative" className="mr-05" onClick={handleClickSaveButton}>
                        공유
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EtcButtonRenderer;
