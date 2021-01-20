import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import not_found from '@assets/images/not_found.png';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * width
     */
    width: PropTypes.number,
    /**
     * height
     */
    height: PropTypes.number,
    /**
     * img 링크
     */
    img: PropTypes.string,
    /**
     * 이미지 alt
     */
    alt: PropTypes.string,
};
const defaultProps = {
    width: 171,
    height: 180,
    alt: '',
};

/**
 * 이미지 컴포넌트(Figure)
 */
const MokaImage = (props) => {
    const { width, height, img, className, alt } = props;
    const wrapRef = useRef(null);
    const imgRef = useRef(null);
    const [src, setImgSrc] = useState(null);

    useEffect(() => {
        if (!img) {
            setImgSrc(not_found);
        }
    }, [img]);

    return (
        <div className={clsx('d-inline-flex align-items-center justify-content-center position-relative bg-white input-border', className)} style={{ width, height }} ref={wrapRef}>
            {/* 이미지 미리보기 */}
            <img alt={alt} src={src} ref={imgRef} className="center-image" />
        </div>
    );
};

MokaImage.propTypes = propTypes;
MokaImage.defaultProps = defaultProps;

export default MokaImage;
