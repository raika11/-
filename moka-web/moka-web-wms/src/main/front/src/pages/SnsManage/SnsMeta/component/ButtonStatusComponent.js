import React from 'react';
import Button from 'react-bootstrap/Button';
import clsx from 'clsx';

const ButtonStatusComponent = (params) => {
    const { hasSnsArticleSendButtons: hasButtons } = params.node.data;
    const handleClickSaveButton = () => {};

    return (
        <div
            className={clsx('d-flex h-100 w-100 align-items-center', {
                // 실제로 안탐
                'justify-content-between': Object.values(hasButtons).filter((isTrue) => isTrue === true).length > 1,
                'justify-content-center': Object.values(hasButtons).filter((isTrue) => isTrue === true).length <= 1,
            })}
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
    );
};

export default ButtonStatusComponent;
