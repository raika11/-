import React from 'react';
import { Col, Row } from 'react-bootstrap';

const MultiRowColumnComponent = ({ values }) => {
    return (
        <>
            {values.map((value, index) => (
                <div className="d-flex">
                    <p className="mb-0 flex-fill text-truncate" key={index}>
                        {value}
                    </p>
                </div>
            ))}
            <p className="mb-0 flex-fill text-truncate">hh</p>
        </>
    );
};

export default MultiRowColumnComponent;
