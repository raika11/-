import React from 'react';
import Figure from 'react-bootstrap/Figure';

const ImageRenderer = ({ value }) => {
    return (
        <>
            <Figure.Image className="mb-0" src={value} />
        </>
    );
};

export default ImageRenderer;
