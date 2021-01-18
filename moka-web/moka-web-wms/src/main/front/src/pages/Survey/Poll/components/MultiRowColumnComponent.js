import React from 'react';
import { Col, Row } from 'react-bootstrap';

const MultiRowColumnComponent = ({ values }) => {
    return (
        <div className="h-100 d-flex align-items-center">
            <div>
                {values.map((value, index) => (
                    <div className="d-flex" key={index}>
                        <p className="mb-0 flex-fill text-truncate">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultiRowColumnComponent;
