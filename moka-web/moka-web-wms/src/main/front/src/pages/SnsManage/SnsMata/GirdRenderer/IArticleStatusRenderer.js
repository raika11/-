import React from 'react';
import Button from 'react-bootstrap/Button';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IArticleStatusRenderer = (params) => {
    const status = 'Y';
    let clazz = status === 'Y' ? 'color-negative' : '';

    const handleClickSaveButton = () => {};
    return (
        <>
            <div className="d-flex py-2">
                <div className="d-flex py-2">
                    <div className="justify-content-between mr-3 p-1">
                        <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />
                    </div>
                    <div className="justify-content-between mr-3 p-1">2020-11-25 16:40:05</div>
                    <div className="justify-content-between mr-3 p-1">
                        <Button variant="negative" className="mr-0" onClick={handleClickSaveButton}>
                            전송
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IArticleStatusRenderer;
