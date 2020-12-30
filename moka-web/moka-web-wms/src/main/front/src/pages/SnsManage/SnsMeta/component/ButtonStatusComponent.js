import React from 'react';
import Button from 'react-bootstrap/Button';
import clsx from 'clsx';

const ButtonStatusComponent = ({ hasButtons }) => {
    const handleClickSaveButton = () => {};

    return (
        <div className="d-flex py-2 justify-content-center">
            <div
                className={clsx(
                    'd-flex py-2 w-100',
                    Object.values(hasButtons).filter((isTrue) => isTrue === true).length > 1 ? 'justify-content-between' : ' justify-content-center',
                )}
            >
                {hasButtons.send && (
                    <Button variant="outline-table-btn" className="mr-0" size="sm" onClick={handleClickSaveButton}>
                        전송
                    </Button>
                )}
                {hasButtons.reSend && (
                    <Button variant="outline-table-btn" className="mr-0" size="sm" onClick={handleClickSaveButton}>
                        재전송
                    </Button>
                )}
                {hasButtons.delete && (
                    <Button variant="outline-table-btn" className="mr-0" size="sm" onClick={handleClickSaveButton}>
                        삭제
                    </Button>
                )}
                {/*{value === 'Y' ? (
                        <Button variant="outline-table-btn" className="mr-0" size="sm" onClick={handleClickSaveButton}>
                            재전송
                        </Button>
                    ) : (
                        <Button variant="outline-table-btn" className="mr-0" size="sm" onClick={handleClickSaveButton}>
                            전송
                        </Button>
                    )}*/}
            </div>
        </div>
    );
};

export default ButtonStatusComponent;
