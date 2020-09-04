import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import styles from '~/assets/jss/components/WmsButtons/WmsIconButtonStyle';

const useStyles = makeStyles(styles);

/**
 * WmsIconButton 아이콘 베이스 버튼
 * @param {object} props Props
 */
const WmsIconButton = (props) => {
    const {
        overrideClassName,
        children,
        color,
        size,
        notification,
        icon,
        round,
        square,
        disabled,
        buttonRef,
        bar,
        ...rest
    } = props;
    const classes = useStyles();

    const notice = () => {
        if (notification) {
            return <div className={classes.noticePoint}>notice</div>;
        }
        return false;
    };

    return (
        <IconButton
            className={clsx(
                {
                    [classes.round]: round,
                    [classes.disabled]: disabled,
                    [classes.bar]: bar,
                    [classes.square]: square,
                    [classes[color]]: color,
                    [classes.disabled]: disabled
                },
                overrideClassName
            )}
            {...rest}
            ref={buttonRef}
            size={size}
            notification={notification}
        >
            {notice()}
            {children}
            {icon && <Icon>{icon}</Icon>}
        </IconButton>
    );
};

WmsIconButton.propTypes = {
    // 아이콘 색상
    color: PropTypes.string,
    children: PropTypes.node,
    notification: PropTypes.string,
    icon: PropTypes.string,
    disabled: PropTypes.bool
};

WmsIconButton.defaultProps = {
    color: undefined,
    children: undefined,
    notification: undefined,
    icon: undefined,
    disabled: undefined
};

export default WmsIconButton;
