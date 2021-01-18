import React, { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import util from '@utils/commonUtil';
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

    const [imgSrc, setImgSrc] = useState(null);
    const wrapRef = useRef(null);
    const imgRef = useRef(null);

    /**
     * 이미지 프리뷰 생성
     */
    const previewImg = useCallback((src) => {
        util.makeImgPreview(
            src,
            imgRef.current,
            wrapRef.current,
            () => {
                setImgSrc(src);
            },
            () => {
                let rate = (wrapRef.current.innerWidth || wrapRef.current.offsetWidth) / (wrapRef.current.innerHeight || wrapRef.current.offsetHeight);
                if (1 > rate) {
                    imgRef.current.className = 'landscape';
                } else {
                    imgRef.current.className = 'portrait';
                }
                setImgSrc(not_found);
            },
        );
    }, []);

    useEffect(() => {
        if (img) {
            previewImg(img);
        }
    }, [img, previewImg]);

    return (
        <div className={clsx('d-inline-flex align-items-center justify-content-center position-relative bg-white input-border', className)} style={{ width, height }} ref={wrapRef}>
            {/* 이미지 미리보기 */}
            <img alt={alt} src={imgSrc} ref={imgRef} />
        </div>
    );
};

MokaImage.propTypes = propTypes;
MokaImage.defaultProps = defaultProps;

export default MokaImage;
