import React, { useState, useRef } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

import Figure from 'react-bootstrap/Figure';
import img from '@assets/images/react.svg';
import { ACCEPTED_IMAGE_TYPES } from '@/constants';

const propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
};
const defaultProps = {
    width: 171,
    height: 180
};

const MokaImageInput = (props) => {
    const { width, height } = props;
    const [imgSrc, setImgSrc] = useState(img);
    const imgRef = useRef(null);

    const onDrop = (acceptedFiles) => {
        console.log(acceptedFiles);
        if (ACCEPTED_IMAGE_TYPES.includes(acceptedFiles[0].type)) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(acceptedFiles[0]);
            fileReader.onload = (f) => {
                let image = new Image();
                image.src = f.target.result;
                image.onload = (imgProps) => {
                    let w = imgProps.path[0].width;
                    let h = imgProps.path[0].height;
                    let rate = width / height;

                    if (w / h > rate) {
                        imgRef.current.className = 'landscape';
                    } else {
                        imgRef.current.className = 'portrait';
                    }
                    setImgSrc(f.target.result);
                };
            };
        }
    };

    return (
        <div>
            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <Figure
                        {...getRootProps()}
                        className="overflow-hidden d-inline-flex align-items-center justify-content-center"
                        style={{ width, height }}
                    >
                        <Figure.Image
                            width={width}
                            height={height}
                            alt="171x180"
                            src={imgSrc}
                            ref={imgRef}
                        />
                        <input {...getInputProps()} />
                    </Figure>
                )}
            </Dropzone>
        </div>
    );
};

MokaImageInput.propTypes = propTypes;
MokaImageInput.defaultProps = defaultProps;

export default MokaImageInput;
