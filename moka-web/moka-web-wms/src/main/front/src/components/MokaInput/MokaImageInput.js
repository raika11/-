import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

import Figure from 'react-bootstrap/Figure';
import img from '@assets/images/react.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import { ACCEPTED_IMAGE_TYPES } from '@/constants';
import MokaAlert from '@components/MokaAlert';

const propTypes = {
    /**
     * width
     */
    width: PropTypes.number,
    /**
     * height
     */
    height: PropTypes.number,
    /**
     * 사진이 아닌 타입이 들어왔을 때 나타나는 alert props
     */
    alertProps: PropTypes.shape({
        outline: PropTypes.bool,
        variant: PropTypes.string,
        heading: PropTypes.string,
        body: PropTypes.string
    })
};
const defaultProps = {
    width: 171,
    height: 180,
    alertProps: {
        outline: false,
        variant: 'danger',
        heading: null,
        body: '이미지파일만 등록할 수 있습니다'
    }
};

/**
 * 이미지파일input + preview + dropzone
 * react-dropzone 사용
 */
const MokaImageInput = (props) => {
    const { width, height, alertProps } = props;
    const [imgSrc, setImgSrc] = useState(img);
    const [alert, setAlert] = useState(false);
    const imgRef = useRef(null);
    const wrapRef = useRef(null);

    const onDrop = (acceptedFiles) => {
        wrapRef.current.classList.remove('dropzone-dragover');
        if (ACCEPTED_IMAGE_TYPES.includes(acceptedFiles[0].type)) {
            setAlert(false);
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
        } else {
            // 이미지가 아닐 경우 alert 처리
            setAlert(true);
        }
    };

    const onDragEnter = (e) => {
        wrapRef.current.classList.add('dropzone-dragover');
    };

    const onDragLeave = (e) => {
        wrapRef.current.classList.remove('dropzone-dragover');
    };

    return (
        <Dropzone
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            preventDropOnDocument
        >
            {({ getRootProps, getInputProps }) => (
                <Figure
                    {...getRootProps()}
                    className={clsx(
                        'overflow-hidden',
                        'd-inline-flex',
                        'align-items-center',
                        'justify-content-center',
                        'is-file-dropzone',
                        'relative'
                    )}
                    style={{ width, height }}
                    ref={wrapRef}
                >
                    <Figure.Image
                        width={width}
                        height={height}
                        alt={`${width}x${height}`}
                        src={imgSrc}
                        ref={imgRef}
                    />
                    <input {...getInputProps()} />
                    <div className="absolute-top">
                        <MokaAlert {...alertProps} show={alert}>
                            {alertProps.heading && (
                                <MokaAlert.Heading>{alertProps.heading}</MokaAlert.Heading>
                            )}
                            <p>{alertProps.body}</p>
                        </MokaAlert>
                    </div>
                    <div className="dropzone-dragover-mask" />
                </Figure>
            )}
        </Dropzone>
    );
};

MokaImageInput.propTypes = propTypes;
MokaImageInput.defaultProps = defaultProps;

export default MokaImageInput;
