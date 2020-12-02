import React from 'react';
import Button from 'react-bootstrap/Button';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IArticleStatusRenderer = ({ value: { senddate, sendflag, status } }) => {
    const handleClickSaveButton = () => {};
    return (
        <>
            <div className="d-flex py-2">
                <div className="d-flex py-2">
                    <div className="justify-content-between mr-3 p-1">
                        <FontAwesomeIcon icon={faCircle} fixedWidth className={status === 'Y' ? 'color-positive' : 'color-gray150'} />
                    </div>
                    <div className="justify-content-between mr-3 p-1">{senddate}</div>
                    <div className="justify-content-between mr-3 p-1">
                        {status === 'Y' ? (
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

export default IArticleStatusRenderer;
