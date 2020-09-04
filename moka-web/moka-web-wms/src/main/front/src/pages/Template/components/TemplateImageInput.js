import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import DragAndDrop from './DragAndDrop';
import { acceptedImageTypes } from '~/constants';
import { WmsButton, WmsAlert } from '~/components';
import { setWmsImgSrc, checkSameImg } from '~/utils/imageUtil';
import style from '~/assets/jss/pages/Template/TemplateImageInputStyle';

const useStyle = makeStyles(style);

/**
 * 템플릿 수정폼 > 이미지input
 */
const TemplateImageInput = (props) => {
    const { file, setFile, originImgSrc, setTemplateThumbnail } = props;
    const classes = useStyle();
    const imgRef = useRef();
    const imgBoxRef = useRef();
    const fileRef = useRef();
    const { loading } = useSelector(({ loadingStore }) => ({
        loading: loadingStore['templateStore/SAVE_TEMPLATE']
    }));
    const [previewing, setPreviewing] = useState(false);
    const [imgLoadErr, setImgLoadErr] = useState(false);

    /**
     * 이미지 생성 및 프리뷰 생성
     */
    const imageCreator = useCallback(
        (src) => {
            setImgLoadErr(false);
            let image = new Image();
            image.src = src;
            image.onload = (imgProps) => {
                let w = imgProps.path[0].width;
                let h = imgProps.path[0].height;
                let rate = 1;
                if (imgBoxRef.current) {
                    rate = imgBoxRef.current.clientWidth / imgBoxRef.current.clientHeight;
                }
                try {
                    if (w / h > rate) {
                        imgRef.current.className = classes.landscape;
                    } else {
                        imgRef.current.className = classes.portrait;
                    }
                    imgRef.current.src = src;
                    setPreviewing(true);
                } catch (e) {
                    // console.log(e);
                }
            };
            image.onerror = () => {
                // 이미지 로드 실패 시 alert 보여주기
                setImgLoadErr(true);
                setPreviewing(false);
            };
        },
        [classes]
    );

    /**
     * 이미지 파일 등록 시 프리뷰 기능
     */
    const imagePreview = useCallback(
        (imgFile) => {
            if (acceptedImageTypes.includes(imgFile.type)) {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(imgFile);
                fileReader.onload = (f) => {
                    imageCreator(f.target.result);
                };
            }
        },
        [imageCreator]
    );

    /**
     * 파일 드롭 콜백 함수
     * @param {Array} dragFiles 드롭된 파일
     */
    const handleDrop = useCallback(
        (dragFiles) => {
            setFile(dragFiles[0]);
        },
        [setFile]
    );

    /**
     * input file 대체하는 div 클릭 콜백
     * @param {object} e 이벤트
     */
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (fileRef.current) {
            fileRef.current.click();
        }
    };

    /**
     * 파일 input change 콜백
     * @param {object} e 이벤트
     */
    const onChangeInputFile = (e) => {
        setFile(e.target.files[0]);
    };

    /**
     * 파일 삭제(기존 썸네일, input file 모두 삭제)
     */
    const onDelete = () => {
        setFile(null);
        fileRef.current.value = null;
        setPreviewing(false);
        setImgLoadErr(false);
        setTemplateThumbnail(undefined);
    };

    // 파일이 넘어오면 프리뷰 기능 실행
    useEffect(() => {
        if (file) {
            imagePreview(file);
        } else if (!loading && originImgSrc) {
            if (!checkSameImg(originImgSrc, imgRef.current.src)) {
                imageCreator(setWmsImgSrc(originImgSrc));
            } else if (!previewing) {
                imageCreator(setWmsImgSrc(originImgSrc));
            }
        } else if (!loading) {
            setPreviewing(false);
            imgRef.current.src = null;
        }
        setImgLoadErr(false);
    }, [file, loading, imagePreview, previewing, imageCreator, originImgSrc]);

    return (
        <div className={classes.root}>
            <Typography variant="body1" className={classes.label} component="div">
                대표이미지
                <WmsButton color="wolf" onClick={onDelete}>
                    삭제
                </WmsButton>
            </Typography>
            <DragAndDrop overrideClassName={classes.drag} handleDrop={handleDrop}>
                {/* 파일 드롭 이미지 */}
                <div
                    role="button"
                    className={classes.dragInner}
                    onClick={handleClick}
                    onKeyDown={handleClick}
                    tabIndex={0}
                >
                    <CloudUploadIcon />
                    <Typography>Drop files to attach, or browse.</Typography>
                </div>
                {/* 이미지 로드 에러 시 노출 */}
                {imgLoadErr && (
                    <WmsAlert
                        message="이미지를 가져오지 못했습니다"
                        severity="error"
                        overrideClassName={classes.alert}
                    />
                )}
                {/* 이미지 미리보기 */}
                <div
                    ref={imgBoxRef}
                    className={clsx(classes.preview, { [classes.previewOn]: previewing })}
                >
                    <img ref={imgRef} alt="이미지미리보기" />
                </div>
                {/* 파일input */}
                <input
                    className={classes.hide}
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    onChange={onChangeInputFile}
                />
            </DragAndDrop>
        </div>
    );
};

export default TemplateImageInput;
