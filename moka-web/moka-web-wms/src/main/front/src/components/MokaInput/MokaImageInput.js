import React, { useState, useCallback, forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import clsx from 'clsx';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Figure from 'react-bootstrap/Figure';
import { ACCEPTED_IMAGE_TYPES } from '@/constants';
import { MokaAlert, MokaIcon } from '@components';
import img_logo from '@assets/images/img_logo@3x.png';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * width
     * @default
     */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * height
     */
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 사진이 아닌 타입이 들어왔을 때 나타나는 alert props
     * @default
     */
    alertProps: PropTypes.shape({
        outline: PropTypes.bool,
        variant: PropTypes.string,
        heading: PropTypes.string,
        body: PropTypes.string,
    }),
    /**
     * img 링크
     */
    img: PropTypes.string,
    /**
     * 부모 컴포넌트에서 파일 value를 state로 관리하는 경우,
     * 이 컴포넌트에서 input file 값이 바꼈을 때 부모의 state도 변경해줘야한다.
     * 그때 전달받는 함수.
     */
    setFileValue: PropTypes.func,
    /**
     * 파일 변경 시 실행
     */
    onChange: PropTypes.func,
    /**
     * 이미지 alt
     * @default
     */
    alt: PropTypes.string,
    /**
     * 업로드 가능 이미지 타입
     * @default
     */
    selectAccept: PropTypes.array,
    /**
     * 타당한 데이터 체크
     */
    isInvalid: PropTypes.bool,
    /**
     * 이미지 삭제 버튼 추가
     * @default
     */
    deleteButton: PropTypes.bool,

    /**
     * 에러 이미지 사용
     */
    isUsedDefaultImage: PropTypes.bool,
};
const defaultProps = {
    width: 171,
    alertProps: {
        outline: false,
        variant: 'danger',
        heading: null,
        body: '이미지파일만 등록할 수 있습니다',
    },
    alt: '이미지',
    selectAccept: [],
    deleteButton: false,
    isUsedDefaultImage: false,
};

/**
 * 이미지파일input + preview + dropzone
 * react-dropzone 사용
 */
const MokaImageInput = forwardRef((props, ref) => {
    const { width, height, alertProps, img, setFileValue, alt, className, selectAccept, isInvalid, onChange, onMouseEnter, onMouseLeave, deleteButton, isUsedDefaultImage } = props;

    // state
    const [imgSrc, setImgSrc] = useState(null);
    const [alert, setAlert] = useState(false);

    // ref
    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const imgRef = useRef(null);
    const wrapRef = useRef(null);
    const defaultRef = useRef(null);

    const imageHide = useCallback(() => {
        if (imgRef.current) {
            imgRef.current.classList.add('d-none');
        }
        defaultRef.current.classList.remove('d-none');
        defaultRef.current.classList.add('d-flex');
        setImgSrc(null);
    }, []);

    const imageShow = useCallback(() => {
        if (imgRef.current) {
            imgRef.current.classList.remove('d-none');
        }
        defaultRef.current.classList.add('d-none');
        defaultRef.current.classList.remove('d-flex');
    }, []);

    // 기본 얼럿 메시지 유지를 위해.
    const handleEtcAlert = (message) => {
        alertProps.body = message;
        setAlert(true);
        imageHide();
        alertProps.body = '이미지파일만 등록할 수 있습니다';
    };

    const handleErrorImage = (e) => {
        if (isUsedDefaultImage) {
            e.target.src = img_logo;
            wrapRef.current.classList.add('onerror-image-wrap');
            e.target.classList.add('onerror-image');
        }
    };

    const handleLoadImage = (e) => {
        if (isUsedDefaultImage) {
            if (e.target.src.replace(window.location.origin, '') !== img_logo) {
                wrapRef.current.classList.remove('onerror-image-wrap');
                e.target.classList.remove('onerror-image');
            }
        }
    };

    /**
     * input의 file 삭제하는 함수
     */
    const deleteFile = useCallback(() => {
        if (setFileValue) {
            setFileValue(null);
        }
        if (inputRef.current) {
            inputRef.current.value = null;
        }

        if (isUsedDefaultImage && imgRef.current) {
            imgRef.current.classList.remove('onerror-image');
        }
        imageHide();
        setAlert(false);
    }, [setFileValue, imageHide]);

    /**
     * 파일 드롭
     * @param {array} acceptedFiles input의 file객체(array)
     */
    const onDrop = (acceptedFiles) => {
        wrapRef.current.classList.remove('dropzone-dragover');
        if (ACCEPTED_IMAGE_TYPES.includes(acceptedFiles[0].type)) {
            // 업로드 가능 확장자 체크
            if (selectAccept.length > 0 && selectAccept.includes(acceptedFiles[0].type) === false) {
                handleEtcAlert(`확장자 (${selectAccept.map((n) => n.split('/')[1]).join(', ')})만 가능합니다.`);
                return;
            }

            setAlert(false);
            setImgSrc(URL.createObjectURL(acceptedFiles[0]));
            imageShow();
            if (setFileValue) setFileValue(acceptedFiles[0]);
            if (onChange) onChange(acceptedFiles);
        } else {
            // 이미지가 아닐 경우 alert 처리
            setAlert(true);
            imageHide();
            if (onChange) onChange();
        }
    };

    const handleDragEnter = (e) => {
        wrapRef.current.classList.add('dropzone-dragover');
    };

    const handleDragLeave = (e) => {
        wrapRef.current.classList.remove('dropzone-dragover');
    };

    useEffect(() => {
        setImgSrc(img);
        if (img) {
            imageShow();
        } else {
            imageHide();
        }
    }, [img, imageShow, imageHide]);

    // 리턴 ref 설정
    useImperativeHandle(
        ref,
        () => ({
            rootRef: rootRef.current,
            wrapRef: wrapRef.current,
            inputRef: inputRef.current,
            imgRef: imgRef.current,
            defaultTextRef: defaultRef.current,
            deleteFile: deleteFile,
            imageHide: imageHide,
            imageShow: imageShow,
        }),
        [deleteFile, imageHide, imageShow],
    );

    return (
        <Dropzone onDrop={onDrop} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} preventDropOnDocument>
            {({ getRootProps, getInputProps }) => {
                const rootProps = getRootProps();
                const inputProps = getInputProps();
                rootRef.current = rootProps;
                inputRef.current = inputProps;

                return (
                    <Figure
                        {...rootProps}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onClick={(e) => {
                            if (alert === false && imgSrc === null) {
                                rootProps.onClick(e);
                            }
                        }}
                        className={clsx(
                            'd-inline-flex align-items-center justify-content-center is-file-dropzone cursor-pointer position-relative bg-white overflow-hidden',
                            className,
                            { 'is-invalid': isInvalid },
                        )}
                        style={{ width, height: height || (width * 9) / 16 }}
                        ref={wrapRef}
                        as="div"
                    >
                        {/* 이미지 미리보기 */}
                        <Figure.Image className="center-image" alt={alt} src={imgSrc} ref={imgRef} onLoad={handleLoadImage} onError={handleErrorImage} />

                        {/* 파일 삭제 버튼 */}
                        {deleteButton && imgSrc && (
                            <Button
                                variant="searching"
                                className="border-0 p-0 moka-table-button"
                                style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.8' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    deleteFile();
                                }}
                            >
                                <MokaIcon iconName="fas-times" />
                            </Button>
                        )}

                        {/* input file */}
                        <input {...inputProps} />

                        {/* alert */}
                        <div className="absolute-top">
                            <MokaAlert {...alertProps} show={alert}>
                                {alertProps.heading && <MokaAlert.Heading>{alertProps.heading}</MokaAlert.Heading>}
                                <p>{alertProps.body}</p>
                            </MokaAlert>
                        </div>

                        {/* default text */}
                        <span
                            className="absolute-top w-100 h-100 d-flex align-items-center justify-content-center pointer-events-none p-3"
                            ref={defaultRef}
                            style={{ whiteSpace: 'pre-wrap' }}
                        >
                            {alert === false && (
                                <>
                                    <MokaIcon iconName="fal-cloud-upload" className="mr-2" />
                                    Drop files to attach, or browse
                                </>
                            )}
                        </span>

                        {/* drag over mask */}
                        <div className="dropzone-dragover-mask input-border" />
                    </Figure>
                );
            }}
        </Dropzone>
    );
});

MokaImageInput.propTypes = propTypes;
MokaImageInput.defaultProps = defaultProps;

export default MokaImageInput;
