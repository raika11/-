import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { WmsSelect, WmsTextField, WmsText, WmsCopyToClipboard } from '~/components';
import style from '~/assets/jss/pages/Easytest/EasytestInfoStyle';

/**
 * TemplateInfoContainer Style
 */
const useStyle = makeStyles(style);

const EasytestForm = (props) => {
    const classes = useStyle();

    return (
        <>
            <div className={clsx(classes.id, classes.mb8)}>
                <WmsText width="172" labelWidth="70" label="Test" />
            </div>
            <div className={classes.mb8}>
                <WmsTextField
                    fullWidth
                    placeholder="템플릿명을 입력하세요"
                    labelWidth="70"
                    label="Test"
                    required
                />
            </div>
            <div className={classes.mb8}>
                <WmsSelect fullWidth labelWidth="70" label="Test" />
            </div>
            <div className={clsx(classes.size, classes.mb8)}>
                <WmsTextField
                    placeholder="Size"
                    label="Size"
                    labelWidth="70"
                    width="170"
                    inputProps={{ type: 'number' }}
                />
                <div className="img-size">
                    <WmsTextField
                        width="130"
                        labelWidth="70"
                        label="Img Size"
                        name="cropWidth"
                        inputProps={{ type: 'number' }}
                        placeholder="width"
                    />
                    <Typography>x</Typography>
                    <WmsTextField width="60" inputProps={{ type: 'number' }} placeholder="height" />
                </div>
            </div>
            <div className={classes.mb8}>
                <WmsCopyToClipboard
                    fullWidth
                    labelWidth="70"
                    label="Input Tag"
                    rows={2}
                    multiline
                />
            </div>
            <div className={classes.mb8}>
                <WmsTextField
                    placeholder="내용설명"
                    fullWidth
                    labelWidth="70"
                    label="설명"
                    name="description"
                />
            </div>
        </>
    );
};

export default EasytestForm;
