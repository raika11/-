import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import MataModal from '../modal/MataModal';

const MataButtonRenderer = (params) => {
    const [modalShow, setModalShow] = useState(false);

    const handleClickSaveButton = () => {
        setModalShow(true);
    };
    return (
        <>
            <div className="d-flex py-2">
                <div className="d-flex py-2">
                    <div className="justify-content-between mr-3 p-1">
                        <Button variant="negative" className="mr-05" onClick={handleClickSaveButton}>
                            편집
                        </Button>
                    </div>
                </div>
                <MataModal show={modalShow} onHide={() => setModalShow(false)} onClickSave={null} />
            </div>
        </>
    );
};

export default MataButtonRenderer;
