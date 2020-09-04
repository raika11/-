import React from 'react';
import clsx from 'clsx';
import { InputAdornment, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import style from '~/assets/jss/components/WmsTextFieldStyle';

/**
 * Input Style
 */
const useStyles = makeStyles(style);

/**
 * Search 아이콘이 있는 TextField
 * @param {string} props.overrideClassName className
 * @param {string} props.label 라벨명
 * @param {string|number} props.width div크기
 * @param {string|number} props.labelWidth 라벨크기
 * @param {string} props.value value
 * @param {function} props.onIconClick 아이콘클릭이벤트
 * @param {function} props.onKeyPress 키보드입력이벤트
 * @param {function} props.onEnter 엔터입력이벤트
 */
const WmsTextFieldIcon = (props) => {
    const {
        overrideClassName,
        label,
        width,
        labelWidth,
        value,
        onIconClick,
        onKeyPress,
        onEnter,
        icon,
        iconDisabled,
        disabled,
        required,
        error,
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

    return (
        <FormControl variant="filled" className={clsx(classes.form, overrideClassName)}>
            {label && (
                <Typography variant="subtitle1" className={classes.label} component="div">
                    {label}
                    {required && <div className={classes.requiredData}>*</div>}
                </Typography>
            )}
            <TextField
                className={clsx(classes.textField, {
                    [classes.adornmentIconDisabled]: disabled
                })}
                value={value}
                variant="outlined"
                disabled={disabled}
                onKeyPress={handleKeyPress}
                error={error}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                type="submit"
                                className={classes.adornmentIcon}
                                aria-label="search"
                                onClick={onIconClick}
                                disabled={iconDisabled}
                            >
                                {icon && <Icon>{icon}</Icon>}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                {...rest}
            />
        </FormControl>
    );
};

export default WmsTextFieldIcon;
