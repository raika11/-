import React from 'react';
import Button from 'react-bootstrap/Button';

const MokaTreeLabel = (props) => {
    const { pageaName, onInsert, onDelete } = props;

    return (
        <React.Fragment>
            <span>{pageaName}</span>
            <div className="d-flex align-items-center tree-buttons">
                {onInsert && (
                    <Button className="btn-pill mr-1" size="sm">
                        +
                    </Button>
                )}
                {onDelete && (
                    <Button className="btn-pill" size="sm">
                        -
                    </Button>
                )}
            </div>
        </React.Fragment>
    );
};

export default MokaTreeLabel;
