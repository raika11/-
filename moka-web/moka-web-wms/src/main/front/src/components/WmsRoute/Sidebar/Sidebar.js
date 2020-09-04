import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import style from '~/assets/jss/components/WmsRoute/SidebarStyle';
import TreeMenu from './TreeMenu';
import logo from '~/assets/images/whiteLogo.png';
import mLogo from '~/assets/images/miniLogo.png';

/**
 * Sidebar Style
 */
const useStyle = makeStyles(style);

/**
 * Sidebar
 * @param {object} props
 */
const Sidebar = (props) => {
    const classes = useStyle();
    const {
        fixed,
        sidebarMinimalize,
        sidebarMini,
        toggleOpen,
        setToggleOpen,
        menuClick,
        column,
        menuOn,
        ...rest
    } = props;

    /**
     * 마우스 Enter, Leave 이벤트
     */
    const handleMouseEnter = () => {
        if (sidebarMini) {
            setToggleOpen(true);
        }
    };
    const handleMouseLeave = () => {
        if (sidebarMini) {
            setToggleOpen(false);
        }
    };

    const imgUrl = () => {
        if (sidebarMini && !toggleOpen) {
            return mLogo;
        }
        if (toggleOpen) {
            return logo;
        }
        return logo;
    };

    return (
        <div
            {...rest}
            className={clsx(classes.navi, {
                [classes.naviOn]: sidebarMini,
                [classes.toggleOn]: toggleOpen
            })}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={classes.menuArea}>
                {/* 트리메뉴 */}
                <TreeMenu sidebarMini={sidebarMini} toggleOpen={toggleOpen} {...rest} />
                <div
                    className={clsx(sidebarMini ? classes.miniLogoForm : classes.logoForm, {
                        [classes.toggleLogoForm]: toggleOpen
                    })}
                >
                    <img
                        className={clsx(sidebarMini ? classes.miniLogoImg : classes.logoImg, {
                            [classes.toggleLogoImg]: toggleOpen
                        })}
                        src={imgUrl()}
                        alt="logo_img"
                        title="logo_img"
                    />
                </div>
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    sidebarMinimalize: PropTypes.func,
    sidebarMini: PropTypes.bool.isRequired,
    toggleOpen: PropTypes.bool.isRequired,
    menuClick: PropTypes.func,
    menuOn: PropTypes.bool.isRequired,
    column: PropTypes.string
};

Sidebar.defaultProps = {
    sidebarMinimalize: undefined,
    menuClick: undefined,
    column: undefined
};

export default Sidebar;
