import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import style from '~/assets/jss/components/WmsTextFieldStyle';

const useStyles = makeStyles(style);

/**
 * Divider가 여러개 있는 TextField
 * @param {string} props.label 라벨명
 * @param {string|number} props.width div크기
 * @param {string|number} props.labelWidth 라벨크기
 * @param {boolean} props.required 필수 여부
 * @param {boolean} props.error 에러 여부
 * @param {boolean} props.disabled disabled 여부
 * @param {array} props.views 보이는 영역 props
 */
const TextFieldWithMultipleDivider = (props) => {
    const { label, width, labelWidth, required, disabled, error, views } = props;
    const classes = useStyles({ width, labelWidth });

    return (
        <Paper component="div" className={classes.rootPaper} elevation={0} square>
            {label && (
                <Typography variant="subtitle1" className={classes.label} component="div">
                    {label}
                    {required && <div className={classes.requiredData}>*</div>}
                </Typography>
            )}
            <Paper
                component="div"
                variant="outlined"
                className={clsx(classes.form, classes.textFieldPaper, {
                    [classes.error]: error
                })}
            >
                {views &&
                    views.map((v, index) => {
                        const {
                            icon,
                            iconDisabled,
                            onIconClick,
                            width: inputWidth,
                            ...inputProps
                        } = v;
                        return (
                            <React.Fragment key={index}>
                                <div className={classes.inputWrapper}>
                                    {v.link && (
                                        <Typography
                                            component={Link}
                                            to={v.link}
                                            target="_blank"
                                            className={classes.linkBox}
                                        />
                                    )}
                                    <InputBase
                                        {...inputProps}
                                        disabled={disabled}
                                        className={classes.input}
                                        style={{ width: inputWidth }}
                                        endAdornment={(() => {
                                            if (icon) {
                                                return (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            type="submit"
                                                            className={classes.adormentIcon}
                                                            aria-label="search"
                                                            onClick={onIconClick}
                                                            disabled={iconDisabled}
                                                        >
                                                            <Icon>{icon}</Icon>
                                                        </IconButton>
                                                    </InputAdornment>
                                                );
                                            }
                                            return undefined;
                                        })()}
                                    />
                                </div>
                                {v.divider && (
                                    <Divider orientation="vertical" className={classes.divider} />
                                )}
                            </React.Fragment>
                        );
                    })}
            </Paper>
        </Paper>
    );
};

export default TextFieldWithMultipleDivider;
