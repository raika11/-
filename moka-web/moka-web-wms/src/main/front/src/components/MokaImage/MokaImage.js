import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
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
    /**
     * error시 추가 로직 실행
     */
    onError: PropTypes.func,
    /**
     * load시 추가 로직 실행
     */
    onLoad: PropTypes.func,
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
const MokaImage = forwardRef(({ width, height, img, className, alt, imgClassName, onError: handleError, onLoad: handleLoad, inputBorder, ratio, defaultImg }, ref) => {
    const wrapRef = useRef(null);
    const imgRef = useRef(null);
    const [src, setImgSrc] = useState(null);

    const onError = React.useCallback(
        (e) => {
            e.target.src = defaultImg;
            wrapRef.current.classList.add('onerror-image-wrap');
            e.target.classList.add('onerror-image');
            if (handleError) {
                handleError(imgRef.current);
            }
        },
        [defaultImg, handleError],
    );

    const onLoad = (e) => {
        if (e.target.src.replace(window.location.origin, '') !== defaultImg) {
            wrapRef.current.classList.remove('onerror-image-wrap');
            e.target.classList.remove('onerror-image');
            if (handleLoad) {
                handleLoad(imgRef.current);
            }
        }
    };

    useEffect(() => {
        if (img) {
            setImgSrc(img);
        } else {
            setImgSrc(defaultImg);
            onError({ target: imgRef.current });
        }
    }, [defaultImg, img, onError]);

    useImperativeHandle(
        ref,
        () => ({
            img: imgRef.current,
        }),
        [],
    );

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
});

MokaImage.propTypes = propTypes;
MokaImage.defaultProps = defaultProps;

export default MokaImage;
