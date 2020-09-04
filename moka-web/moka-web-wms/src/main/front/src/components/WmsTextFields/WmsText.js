import React from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import style from '~/assets/jss/components/WmsTextFieldStyle';

const useStyle = makeStyles(style);

/**
 * WmsText
 * @param {string} props.label 라벨명
 * @param {number|string} props.width 영역 width
 * @param {number|string} props.labelWidth 라벨 영역 width
 * @param {string} props.value 값
 * @param {string} props.overrideClassName 오버라이드 클래스명
 * @param {string} props.align right | left
 */
const WmsText = (props) => {
    const { label, width, labelWidth, value, overrideClassName, align, ...rest } = props;
    const classes = useStyle({ width, labelWidth, align });

    return (
        <div className={clsx(classes.form, overrideClassName)}>
            {label && (
                <Typography variant="subtitle1" className={classes.label} component="div" {...rest}>
                    {label}
                </Typography>
            )}
            <Typography variant="body1" className={classes.textField} component="div" {...rest}>
                {value}
            </Typography>
        </div>
    );
};

export default WmsText;
