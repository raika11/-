import React, { useState, useCallback, forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import clsx from 'clsx';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import Figure from 'react-bootstrap/Figure';

import util from '@utils/commonUtil';
import { ACCEPTED_IMAGE_TYPES } from '@/constants';
import { MokaAlert, MokaIcon } from '@components';

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
     * 사진이 아닌 타입이 들어왔을 때 나타나는 alert props
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
     * 이미지 alt
     */
    alt: PropTypes.string,

    /**
     * 업로드 가능 이미지 타입
     */
    selectAccept: PropTypes.array,
};
const defaultProps = {
    width: 171,
    height: 180,
    alertProps: {
        outline: false,
        variant: 'danger',
        heading: null,
        body: '이미지파일만 등록할 수 있습니다',
    },
    alt: '이미지',
    selectAccept: [],
};

/**
 * 이미지파일input + preview + dropzone
 * react-dropzone 사용
 */
const MokaImageInput = forwardRef((props, ref) => {
    const { width, height, alertProps, img, setFileValue, alt, className, selectAccept } = props;

    // state
    const [imgSrc, setImgSrc] = useState(null);
    const [alert, setAlert] = useState(false);

    // ref
    const inputRef = useRef(null);
    const imgRef = useRef(null);
    const wrapRef = useRef(null);
    const defaultRef = useRef(null);

    const imageHide = () => {
        imgRef.current.classList.add('d-none');
        defaultRef.current.classList.remove('d-none');
        defaultRef.current.classList.add('d-flex');
        setImgSrc(null);
    };

    const imageShow = () => {
        imgRef.current.classList.remove('d-none');
        defaultRef.current.classList.add('d-none');
        defaultRef.current.classList.remove('d-flex');
    };

    // 기본 얼럿 메시지 유지를 위해.
    const handleEtcAlert = (message) => {
        alertProps.body = message;
        setAlert(true);
        imageHide();
        alertProps.body = '이미지파일만 등록할 수 있습니다';
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
    }, [setFileValue]);

    // 리턴 ref 설정
    useImperativeHandle(
        ref,
        () => ({
            inputRef: inputRef.current,
            imgRef: imgRef.current,
            defaultTextRef: defaultRef.current,
            deleteFile: deleteFile,
        }),
        [deleteFile],
    );

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
                imageShow();
            },
            () => {
                setImgSrc(src);
                imageShow();
            },
        );
    }, []);

    /**
     * 파일 드롭
     * @param {array} acceptedFiles input의 file객체(array)
     */
    const onDrop = (acceptedFiles) => {
        wrapRef.current.classList.remove('dropzone-dragover');
        if (ACCEPTED_IMAGE_TYPES.includes(acceptedFiles[0].type)) {
            // 업로드 가능 확장자 체크
            if (selectAccept.length > 0 && selectAccept.includes(acceptedFiles[0].type) === false) {
                handleEtcAlert(`업로드 이미지는 (${selectAccept.map((n) => n.split('/')[1]).join(', ')})만 가능합니다.`);
                return;
            }
            setAlert(false);
            const fileReader = new FileReader();
            fileReader.readAsDataURL(acceptedFiles[0]);
            fileReader.onload = (f) => {
                previewImg(f.target.result);
            };
            if (setFileValue) {
                setFileValue(acceptedFiles[0]);
            }
        } else {
            // 이미지가 아닐 경우 alert 처리
            setAlert(true);
            imageHide();
        }
    };

    const handleDragEnter = (e) => {
        wrapRef.current.classList.add('dropzone-dragover');
    };

    const handleDragLeave = (e) => {
        wrapRef.current.classList.remove('dropzone-dragover');
    };

    useEffect(() => {
        if (img) {
            previewImg(img);
        } else {
            imageHide();
        }
    }, [img, previewImg]);

    return (
        <Dropzone onDrop={onDrop} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} preventDropOnDocument>
            {({ getRootProps, getInputProps }) => {
                const inputProps = getInputProps();
                inputRef.current = inputProps.ref.current;

                return (
                    <Figure
                        {...getRootProps()}
                        className={clsx(
                            'd-inline-flex align-items-center justify-content-center is-file-dropzone cursor-pointer position-relative bg-white overflow-hidden',
                            className,
                        )}
                        style={{ width, height }}
                        ref={wrapRef}
                        as="div"
                    >
                        {/* 이미지 미리보기 */}
                        <Figure.Image width={width} height={height} className="mb-0" alt={alt} src={imgSrc} ref={imgRef} />

                        {/* input file */}
                        {alert === false && imgSrc === null && <input {...inputProps} />}

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
                        <div className="dropzone-dragover-mask dropzone-border" />
                    </Figure>
                );
            }}
        </Dropzone>
    );
});

MokaImageInput.propTypes = propTypes;
MokaImageInput.defaultProps = defaultProps;

export default MokaImageInput;
