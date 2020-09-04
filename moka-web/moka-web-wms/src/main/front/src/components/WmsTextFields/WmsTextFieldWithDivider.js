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
 * Divider가 있는 TextField
 * @param {string} props.label 라벨명
 * @param {string|number} props.width div크기
 * @param {string|number} props.labelWidth 라벨크기
 * @param {boolean} props.required 필수 여부
 * @param {boolean} props.error 에러 여부
 * @param {boolean} props.disabled disabled 여부
 * @param {object} props.dividerBefore divider 앞 input 관련 props(InputBase)
 * @param {object} props.dividerAfter divider 뒤 input 관련 props(InputBase)
 */
const WmsTextFieldWithDivider = (props) => {
    const {
        label,
        width,
        labelWidth,
        required,
        disabled,
        error,
        dividerBefore,
        dividerAfter
    } = props;

    // dividerBefore 옵션
    const {
        icon: beforeIcon,
        onIconClick: beforeIconClick,
        iconDisabled: beforeIconDisabled,
        link: beforeLink,
        width: beforeWidth,
        ...beforeProps
    } = dividerBefore;

    // dividerAfter 옵션
    const {
        icon: afterIcon,
        onIconClick: afterIconClick,
        iconDisabled: afterIconDisabled,
        link: afterLink,
        ...afterProps
    } = dividerAfter;

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
                    // [classes.disabled]: disabled,
                    [classes.error]: error
                })}
            >
                <div className={classes.inputWrapper}>
                    {beforeLink && (
                        <Typography
                            component={Link}
                            to={beforeLink}
                            target="_blank"
                            className={classes.linkBox}
                        />
                    )}
                    <InputBase
                        {...beforeProps}
                        disabled={disabled}
                        className={classes.input}
                        style={{ width: beforeWidth }}
                        endAdornment={(() => {
                            if (beforeIcon) {
                                return (
                                    <InputAdornment position="end">
                                        <IconButton
                                            type="submit"
                                            className={classes.icon}
                                            aria-label="search"
                                            onClick={beforeIconClick}
                                            disabled={beforeIconDisabled}
                                        >
                                            <Icon>{beforeIcon}</Icon>
                                        </IconButton>
                                    </InputAdornment>
                                );
                            }
                            return undefined;
                        })()}
                    />
                </div>
                <Divider orientation="vertical" className={classes.divider} />
                <div
                    className={classes.inputWrapper}
                    style={{ width: `calc(100% - ${beforeWidth}px - 1px)` }}
                >
                    {afterLink && (
                        <Typography
                            component={Link}
                            to={afterLink}
                            target="_blank"
                            className={classes.linkBox}
                        />
                    )}
                    <InputBase
                        {...afterProps}
                        disabled={disabled}
                        className={classes.input}
                        style={{ width: '100%' }}
                        endAdornment={(() => {
                            if (afterIcon) {
                                return (
                                    <InputAdornment position="end">
                                        <IconButton
                                            type="submit"
                                            className={classes.icon}
                                            aria-label="search"
                                            onClick={afterIconClick}
                                            disabled={afterIconDisabled}
                                        >
                                            <Icon>{afterIcon}</Icon>
                                        </IconButton>
                                    </InputAdornment>
                                );
                            }
                            return undefined;
                        })()}
                    />
                </div>
            </Paper>
        </Paper>
    );
};

export default WmsTextFieldWithDivider;
