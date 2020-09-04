import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { WmsSelect, WmsTextField, WmsText, WmsCopyToClipboard } from '~/components';
import TemplateImageInput from './TemplateImageInput';
import style from '~/assets/jss/pages/Template/TemplateInfoStyle';

const useStyle = makeStyles(style);

/**
 * 템플릿폼
 * @param {array} props.invalidList invalid 리스트
 * @param {array} props.tpZoneRows 위치그룹 행 데이터
 * @param {object} props.edit 수정가능한 템플릿 데이터
 * @param {string} props.templateName 템플릿명 state
 * @param {string} props.templateWidth 템플릿사이즈 state
 * @param {string} props.cropHeight 이미지사이즈 state
 * @param {string} props.cropWidth 이미지사이즈 state
 * @param {string} props.description 설명 state
 * @param {function} props.handleChange 인풋change핸들러
 * @param {object} props.thumbnail 썸네일파일 데이터
 * @param {function} props.setThumbnail 썸네일파일 데이터 조작
 */
const TemplateForm = (props) => {
    const {
        invalidList,
        tpZoneRows,
        templateSeq,
        templateGroup,
        templateThumbnail,
        setTemplateThumbnail,
        inputTag,
        templateName,
        templateWidth,
        cropHeight,
        cropWidth,
        description,
        handleChange,
        thumbnail,
        setThumbnail
    } = props;
    const classes = useStyle();

    const templateNameRef = useRef(null);
    const [nameError, setNameError] = useState(false);

    useEffect(() => {
        setNameError(false);
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'templateName') {
                    templateNameRef.current.focus();
                    setNameError(true);
                }
            });
        }
    }, [invalidList]);

    const nameChange = (e) => {
        if (nameError) {
            setNameError(false);
        }
        handleChange(e);
    };

    return (
        <>
            <div className={clsx(classes.id, classes.mb8)}>
                <WmsText value={templateSeq} width="172" labelWidth="70" label="템플릿ID" />
            </div>
            <div className={classes.mb8}>
                <WmsTextField
                    fullWidth
                    placeholder="템플릿명을 입력하세요"
                    labelWidth="70"
                    label="템플릿명"
                    name="templateName"
                    value={templateName}
                    onChange={nameChange}
                    inputRef={templateNameRef}
                    error={nameError}
                    required
                />
            </div>
            <div className={classes.mb8}>
                <WmsSelect
                    fullWidth
                    rows={tpZoneRows}
                    labelWidth="70"
                    label="위치그룹"
                    name="templateGroup"
                    currentId={templateGroup}
                    onChange={handleChange}
                />
            </div>
            <div className={clsx(classes.size, classes.mb8)}>
                <WmsTextField
                    placeholder="템플릿사이즈"
                    label="사이즈"
                    labelWidth="70"
                    width="170"
                    name="templateWidth"
                    value={templateWidth}
                    onChange={handleChange}
                    inputProps={{ type: 'number' }}
                />
                <div className="img-size">
                    <WmsTextField
                        width="130"
                        labelWidth="70"
                        label="이미지사이즈"
                        name="cropWidth"
                        value={cropWidth}
                        onChange={handleChange}
                        inputProps={{ type: 'number' }}
                        placeholder="가로"
                    />
                    <Typography>x</Typography>
                    <WmsTextField
                        width="60"
                        name="cropHeight"
                        value={cropHeight}
                        onChange={handleChange}
                        inputProps={{ type: 'number' }}
                        placeholder="세로"
                    />
                </div>
            </div>
            <div className={classes.mb8}>
                <WmsCopyToClipboard
                    fullWidth
                    labelWidth="70"
                    label="입력태그"
                    rows={2}
                    multiline
                    value={inputTag}
                />
            </div>
            <div className={classes.mb8}>
                <TemplateImageInput
                    originImgSrc={templateThumbnail}
                    setTemplateThumbnail={setTemplateThumbnail}
                    file={thumbnail}
                    setFile={setThumbnail}
                />
            </div>
            <div className={classes.mb8}>
                <WmsTextField
                    placeholder="내용설명"
                    fullWidth
                    labelWidth="70"
                    label="설명"
                    name="description"
                    value={description}
                    onChange={handleChange}
                />
            </div>
        </>
    );
};

export default TemplateForm;
