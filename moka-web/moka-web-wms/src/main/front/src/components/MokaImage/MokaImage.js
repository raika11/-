import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import img_logo from '@assets/images/img_logo@3x.png';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * img 태그 className
     */
    imgClassName: PropTypes.string,
    /**
     * width
     * @default
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
     * 기본 이미지
     * @default
     */
    defaultImg: PropTypes.any,
    /**
     * 이미지 alt
     */
    alt: PropTypes.string,
    /**
     * input 에 쓰이는 border 테두리
     * @default
     */
    inputBorder: PropTypes.bool,
    /**
     * 사진 비율 (기본 [16, 9])
     * @default
     */
    ratio: PropTypes.array,
};
const defaultProps = {
    width: 171,
    alt: '',
    inputBorder: true,
    ratio: [16, 9],
    defaultImg: img_logo,
};

/**
 * 이미지 컴포넌트(Figure)
 */
const MokaImage = ({ width, height, img, className, alt, imgClassName, inputBorder, ratio, defaultImg }) => {
    const wrapRef = useRef(null);
    const imgRef = useRef(null);
    const [src, setImgSrc] = useState(null);

    const onError = (e) => {
        e.target.src = defaultImg;
        wrapRef.current.classList.add('onerror-image-wrap');
        e.target.classList.add('onerror-image');
    };

    const onLoad = (e) => {
        if (e.target.src.replace(window.location.origin, '') !== defaultImg) {
            wrapRef.current.classList.remove('onerror-image-wrap');
            e.target.classList.remove('onerror-image');
        }
    };

    useEffect(() => {
        if (img) {
            setImgSrc(img);
        } else {
            setImgSrc(defaultImg);
            wrapRef.current.classList.add('onerror-image-wrap');
            imgRef.current.classList.add('onerror-image');
        }
    }, [defaultImg, img]);

    return (
        <div
            className={clsx('d-inline-flex align-items-center justify-content-center position-relative bg-white', className, { 'input-border': inputBorder })}
            style={{ width, height: height || (width * ratio[1]) / ratio[0] }}
            ref={wrapRef}
        >
            {/* 이미지 미리보기 */}
            <img alt={alt} src={src} ref={imgRef} className={clsx('center-image', imgClassName)} loading="lazy" onError={onError} onLoad={onLoad} />
        </div>
    );
};

MokaImage.propTypes = propTypes;
MokaImage.defaultProps = defaultProps;

export default MokaImage;
