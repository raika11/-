import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import MuiButton from '@material-ui/core/Button';
import styles from '~/assets/jss/components/WmsButtons/WmsButtonStyle';

/**
 * Button Style
 */
const useStyles = makeStyles(styles);

/**
 * WMS Button
 */
const WmsButton = (props) => {
    const classes = useStyles();
    const {
        color,
        round,
        children,
        disabled,
        size,
        block,
        link,
        className,
        href,
        overrideClassName,
        ...rest
    } = props;

    return (
        <MuiButton
            disableElevation
            component={href ? Link : 'button'}
            to={href}
            {...rest}
            className={clsx(
                classes.button,
                {
                    [classes[size]]: size,
                    [classes[color]]: color,
                    [classes.round]: round,
                    [classes.disabled]: disabled,
                    [classes.block]: block,
                    [classes.link]: link
                },
                overrideClassName
            )}
        >
            {children}
        </MuiButton>
    );
};

WmsButton.propTypes = {
    // 버튼 색상
    color: PropTypes.string,
    // 버튼 사이즈
    size: PropTypes.oneOf(['sm', 'lg', 'long']),
    // 버튼 라운드 정도
    round: PropTypes.bool,
    // 버튼 사용여부
    disabled: PropTypes.bool,
    // width: 100% !important
    block: PropTypes.bool,
    // 링크 버튼
    link: PropTypes.bool,
    // 기존 클래스명
    className: PropTypes.string,
    // 하위 노드
    children: PropTypes.node.isRequired,
    // 라우터에서 링크 이동
    href: PropTypes.string
};

WmsButton.defaultProps = {
    color: undefined,
    size: 'lg',
    round: undefined,
    disabled: false,
    block: false,
    link: false,
    className: undefined,
    href: undefined
};

export default WmsButton;
