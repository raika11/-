import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextFieldStyle from '~/assets/jss/components/WmsTextFieldStyle';

/**
 * Input Style
 */
const useStyles = makeStyles(TextFieldStyle);

/**
 * WmsTextField
 * @param {string|element} props.label 라벨명
 * @param {string|number} props.width div크기
 * @param {string|number} props.labelWidth 라벨크기
 * @param {string} props.value 값
 * @param {boolean} props.fullWidth fullWidth
 * @param {boolean} props.error 에러여부
 * @param {string} props.overrideClassName overrideClassName
 * @param {string} props.overrideLabelClassName 라벨의 overrideLabelClassName
 * @param {boolean} props.required required여부
 * @param {function} props.onKeyPress 키보드입력이벤트
 * @param {function} props.onEnter 엔터입력이벤트
 */
const WmsTextField = (props) => {
    const {
        label,
        width,
        labelWidth,
        value,
        fullWidth,
        error,
        disabled,
        overrideClassName,
        overrideLabelClassName,
        required,
        onKeyPress,
        onEnter,
        ...rest
    } = props;
    const classes = useStyles({ width, labelWidth });

    /**
     * 키보드 입력 핸들러
     * @param {object} e 클릭이벤트
     */
    const handleKeyPress = (e) => {
        if (onKeyPress) {
            onKeyPress(e);
        }
        if (onEnter && e.key === 'Enter') {
            onEnter(e);
        }
    };

    const TextForm = () => {
        return (
            <FormControl
                fullWidth={fullWidth}
                variant="filled"
                className={clsx(classes.form, overrideClassName)}
            >
                {label && (
                    <Typography
                        variant="subtitle1"
                        component="div"
                        className={clsx(classes.label, overrideLabelClassName)}
                    >
                        {label}
                        {required && <div className={classes.requiredData}>*</div>}
                    </Typography>
                )}
                <TextField
                    {...rest}
                    className={classes.textField}
                    value={String(value)}
                    variant="outlined"
                    onKeyPress={handleKeyPress}
                    fullWidth={fullWidth}
                    error={error}
                    disabled={disabled}
                />
            </FormControl>
        );
    };

    return TextForm();
};

export default WmsTextField;
