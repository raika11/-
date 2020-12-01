import React from 'react';
import Image from 'react-bootstrap/Image';

const ImageComponent = (props) => {
    const { src, rounded, roundedCircle, thumbnail, ...rest } = props;

    return <Image src={src} rounded={rounded && true} roundedCircle={roundedCircle && true} thumbnail={thumbnail && true} {...rest} />;
};

export default ImageComponent;
