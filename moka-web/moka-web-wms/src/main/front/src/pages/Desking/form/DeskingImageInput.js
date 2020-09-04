import React, { useRef, useCallback, useEffect, useState } from 'react';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { acceptedImageTypes } from '~/constants';
import { WmsDialogAlert } from '~/components';

const DeskingImageInput = (props) => {
    const {
        classes,
        thumbnailFile,
        thumbnailFileName,
        setThumnbnailFile,
        setThumbnailFileName,
        workData
    } = props;
    const fileRef = useRef(null);
    const imgRef = useRef(null);
    const [open, setOpen] = useState(false);

    /**
     * 이미지 생성 및 프리뷰 생성
     * @param {string} src 이미지url
     */
    const imageCreator = useCallback(
        (src) => {
            let image = new Image();
            image.src = src;
            image.onload = (imgProps) => {
                let w = imgProps.path[0].width;
                let h = imgProps.path[0].height;
                let rate = 1;

                try {
                    if (w / h > rate) {
                        imgRef.current.className = classes.landscape;
                    } else {
                        imgRef.current.className = classes.portrait;
                    }
                    imgRef.current.src = src;
                    imgRef.current.classList.remove(classes.hide);
                } catch (err) {
                    console.log(err);
                }
            };
        },
        [classes]
    );

    /**
     * 파일 input change
     * @param {object} e 이벤트
     */
    const onChangeInputFile = useCallback(
        (e) => {
            const lfile = e.target.files[0];

            if (acceptedImageTypes.includes(lfile.type)) {
                setThumnbnailFile(lfile);
                const fileReader = new FileReader();
                fileReader.readAsDataURL(lfile);
                fileReader.onload = (f) => {
                    imageCreator(f.target.result);
                };
            } else {
                // jpg, gif, png가 아니면 경고
                setOpen(true);
            }
        },
        [imageCreator, setThumnbnailFile]
    );

    const openFile = () => {
        fileRef.current.click();
    };

    const removeFile = useCallback(() => {
        // 썸네일파일(새파일), 썸네일파일명(기존파일명) 삭제
        if (fileRef.current) fileRef.current.value = null;
        setThumnbnailFile(null);
        setThumbnailFileName('');
        if (imgRef.current) imgRef.current.classList.add(classes.hide);
    }, [classes, setThumbnailFileName, setThumnbnailFile]);

    useEffect(() => {
        removeFile();
    }, [removeFile, workData]);

    useEffect(() => {
        if (thumbnailFileName !== '') {
            imageCreator(`//img.com/${thumbnailFileName}`);
        } else {
            if (imgRef.current) imgRef.current.classList.add(classes.hide);
        }
    }, [thumbnailFileName, imageCreator, classes]);

    return (
        <>
            <input
                className={classes.hide}
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={onChangeInputFile}
            />
            <img ref={imgRef} alt="이미지미리보기" className={classes.hide} />
            {!thumbnailFileName && !thumbnailFile ? (
                <div
                    className={classes.infoRightImageAddBtn}
                    role="button"
                    onClick={openFile}
                    onKeyDown={openFile}
                    tabIndex={-1}
                >
                    <Icon>add</Icon>
                </div>
            ) : (
                <div
                    className={classes.infoRightImageDelBtn}
                    role="button"
                    onClick={removeFile}
                    onKeyDown={removeFile}
                    tabIndex={-1}
                >
                    <Icon>close</Icon>
                </div>
            )}
            <WmsDialogAlert
                title="파일등록 실패"
                open={open}
                type="show"
                onClose={() => setOpen(false)}
            >
                <Typography component="p" variant="body1">
                    jpg, png, gif 파일만 등록하실 수 있습니다.
                </Typography>
            </WmsDialogAlert>
        </>
    );
};

export default DeskingImageInput;
