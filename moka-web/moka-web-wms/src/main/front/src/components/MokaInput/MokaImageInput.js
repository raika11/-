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
     * 타당한 데이터 체크
     */
    isInvalid: PropTypes.bool,
    /**
     * 이미지 삭제 버튼 추가
     * @default
     */
    deleteButton: PropTypes.bool,
    /**
     * input의 accept
     * @default
     */
    accept: PropTypes.string,
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
    deleteButton: false,
    accept: ACCEPTED_IMAGE_TYPES.join(','),
};

/**
 * 이미지파일input + preview + dropzone
 * react-dropzone 사용
 */
const MokaImageInput = forwardRef((props, ref) => {
    const { width, height, alertProps, img, setFileValue, alt, className, isInvalid, onChange, onMouseEnter, onMouseLeave, deleteButton, accept } = props;

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

    /**
     * 기본 alert 메시지 유지
     */
    const handleEtcAlert = (message) => {
        alertProps.body = message;
        setAlert(true);
        imageHide();
    };

    /**
     * 이미지 로드 실패
     */
    const handleErrorImage = (e) => {
        imageHide();
    };

    /**
     * 이미지 로드 성공
     */
    const handleLoadImage = (e) => {
        imageShow();
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
        imageHide();
        setAlert(false);
    }, [setFileValue, imageHide]);

    /**
     * 파일 드롭
     * @param {array} acceptedFiles input의 file객체(array)
     */
    const onDrop = (acceptedFiles) => {
        wrapRef.current.classList.remove('dropzone-dragover');
        const extra = acceptedFiles[0].type;

        // 확장자 체크
        if (extra.indexOf('image/') > -1 && (accept === 'image/*' || accept.includes(extra))) {
            setAlert(false);
            setImgSrc(URL.createObjectURL(acceptedFiles[0]));
            imageShow();
            if (setFileValue) setFileValue(acceptedFiles[0]);
            if (onChange) onChange(acceptedFiles);
        } else {
            handleEtcAlert(`확장자가 ${accept}인 파일만 등록할 수 있습니다`);
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
        img ? imageShow() : imageHide();
    }, [imageHide, imageShow, img]);

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
                        onClick={(e) => (!imgSrc ? rootProps.onClick(e) : null)}
                        className={clsx(
                            'd-inline-flex align-items-center justify-content-center is-file-dropzone cursor-pointer position-relative bg-white overflow-hidden',
                            className,
                            { 'is-invalid': isInvalid },
                        )}
                        style={{ width, height: height || (width * 9) / 16 }}
                        ref={wrapRef}
                        as="div"
                    >
                        {/* drag over mask */}
                        <div className="dropzone-dragover-mask input-border" />

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
                        <input {...inputProps} accept={accept} />

                        {/* alert */}
                        {alert && (
                            <div className="absolute-top" style={{ zIndex: 1 }}>
                                <MokaAlert bodyClassName="p-2" {...alertProps} show>
                                    {alertProps.heading && <MokaAlert.Heading>{alertProps.heading}</MokaAlert.Heading>}
                                    {alertProps.body}
                                </MokaAlert>
                            </div>
                        )}

                        {/* default text */}
                        <span className="absolute-top w-100 h-100 input-border onerror-image-wrap" ref={defaultRef}>
                            {!alert && <Figure.Image src={img_logo} className="center-image onerror-image" alt="error" />}
                        </span>
                    </Figure>
                );
            }}
        </Dropzone>
    );
});

MokaImageInput.propTypes = propTypes;
MokaImageInput.defaultProps = defaultProps;

export default MokaImageInput;
