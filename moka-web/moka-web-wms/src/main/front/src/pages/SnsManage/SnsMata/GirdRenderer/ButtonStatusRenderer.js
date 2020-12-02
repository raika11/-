import React from 'react';
import Button from 'react-bootstrap/Button';

const ButtonStatusRenderer = ({ value }) => {
    console.log(value);
    const handleClickSaveButton = () => {};
    return (
        <>
            <div className="d-flex py-2">
                <div className="d-flex py-2">
                    <div className="justify-content-between mr-3 p-1">
                        {value === 'Y' ? (
                            <Button variant="positive" className="mr-0" onClick={handleClickSaveButton}>
                                재전송
                            </Button>
                        ) : (
                            <Button variant="negative" className="mr-0" onClick={handleClickSaveButton}>
                                전송
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ButtonStatusRenderer;
