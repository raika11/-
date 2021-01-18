import React from 'react';
import { Col, Row } from 'react-bootstrap';

const MultiRowColumnComponent = ({ values }) => {
    return (
        <>
            {values.map((value, index) => (
                <div className="d-flex" key={index}>
                    <p className="mb-0 flex-fill text-truncate">{value}</p>
                </div>
            ))}
        </>
    );
};

export default MultiRowColumnComponent;
