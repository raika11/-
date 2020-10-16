import React, { useState, useCallback, forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import Figure from 'react-bootstrap/Figure';

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
};

/**
 * 이미지파일input + preview + dropzone
 * react-dropzone 사용
 */
const MokaImageInput = forwardRef((props, ref) => {
    const { width, height, alertProps, img, setFileValue } = props;

    // state
    const [imgSrc, setImgSrc] = useState(null);
    const [alert, setAlert] = useState(false);

    // ref
    const inputRef = useRef(null);
    const imgRef = useRef(null);
    const wrapRef = useRef(null);
    const defaultRef = useRef(null);

    /**
     * input의 file 삭제하는 함수
     */
    const deleteFile = useCallback(() => {
        if (setFileValue) {
            setFileValue(null);
        }
        imgRef.current.classList.add('d-none');
        defaultRef.current.classList.remove('d-none');
        defaultRef.current.classList.add('d-flex');
    }, [setFileValue]);

    // 리턴 ref 설정
    useImperativeHandle(
        ref,
        () => ({
            input: inputRef.current,
            previewImg: imgRef.current,
            defaultText: defaultRef.current,
            deleteFile: deleteFile,
        }),
        [deleteFile],
    );

    /**
     * 이미지 프리뷰 생성
     */
    const previewImg = useCallback(
        (src) => {
            let image = new Image();
            image.src = src;
            image.onload = (imgProps) => {
                let w = imgProps.path[0].width;
                let h = imgProps.path[0].height;
                let rate = width / height;

                if (w / h > rate) {
                    imgRef.current.className = 'landscape';
                } else {
                    imgRef.current.className = 'portrait';
                }
                setImgSrc(src);
                defaultRef.current.classList.add('d-none');
                defaultRef.current.classList.remove('d-flex');
            };
        },
        [height, width],
    );

    /**
     * 파일 드롭
     * @param {array} acceptedFiles input의 file객체(array)
     */
    const onDrop = (acceptedFiles) => {
        wrapRef.current.classList.remove('dropzone-dragover');
        if (ACCEPTED_IMAGE_TYPES.includes(acceptedFiles[0].type)) {
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
        }
    };

    const onDragEnter = (e) => {
        wrapRef.current.classList.add('dropzone-dragover');
    };

    const onDragLeave = (e) => {
        wrapRef.current.classList.remove('dropzone-dragover');
    };

    useEffect(() => {
        if (img) {
            previewImg(img);
        } else {
            imgRef.current.classList.add('d-none');
            defaultRef.current.classList.remove('d-none');
            defaultRef.current.classList.add('d-flex');
        }
    }, [img, previewImg]);

    return (
        <Dropzone onDrop={onDrop} onDragEnter={onDragEnter} onDragLeave={onDragLeave} preventDropOnDocument>
            {({ getRootProps, getInputProps }) => {
                const inputProps = getInputProps();
                inputRef.current = inputProps.ref.current;

                return (
                    <Figure
                        {...getRootProps()}
                        className="d-inline-flex align-items-center justify-content-center is-file-dropzone position-relative bg-white"
                        style={{ width, height }}
                        ref={wrapRef}
                        as="div"
                    >
                        {/* 이미지 미리보기 */}
                        <Figure.Image width={width} height={height} alt={`${width}x${height}`} src={imgSrc} ref={imgRef} />

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
                        <span className="absolute-top w-100 h-100 d-flex align-items-center justify-content-center pointer-events-none" ref={defaultRef}>
                            Drop files to attach, or browse
                        </span>

                        {/* drag over mask */}
                        <div className="dropzone-dragover-mask" />
                    </Figure>
                );
            }}
        </Dropzone>
    );
});

MokaImageInput.propTypes = propTypes;
MokaImageInput.defaultProps = defaultProps;

export default MokaImageInput;
