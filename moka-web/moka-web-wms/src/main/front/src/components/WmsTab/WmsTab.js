import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { WmsIconButton } from '~/components';
import styles from '~/assets/jss/components/WmsTabStyle';

const useStyles = makeStyles(styles);

/**
 * WmsTab
 */
const WmsTab = (props) => {
    const {
        tab,
        tabWidth,
        icon,
        onIconClick,
        overrideRootClassName,
        overrideClassName,
        swipeable
    } = props;
    const classes = useStyles({ tabWidth });
    const [currentIdx, setCurrentIdx] = useState(0);
    const [tabList, setTabList] = useState([]);
    const [contentList, setContentList] = useState([]);

    const handleChangeTab = (e, newValue) => {
        setCurrentIdx(newValue);
    };

    const handleChangeIndex = (index) => {
        setCurrentIdx(index);
    };

    useEffect(() => {
        /** 탭이름 리스트 생성 */
        setTabList(
            tab.map((t, index) => (
                <Tab
                    classes={{ root: classes.tabRoot, wrapper: classes.tabWrapper }}
                    label={t.label}
                    key={index}
                    disableFocusRipple
                    disableRipple
                />
            ))
        );
    }, [tab, classes]);

    useEffect(() => {
        /** 탭 컨텐츠리스트 생성 */
        setContentList(
            tab.map((s, index) => (
                <div
                    key={index}
                    role="tabpanel"
                    hidden={currentIdx !== index}
                    id={`full-width-tabpanel-${index}`}
                    aria-labelledby={`full-width-tab-${index}`}
                >
                    {currentIdx === index && <Box component="div">{s.content}</Box>}
                </div>
            ))
        );
    }, [tab, currentIdx]);

    return (
        <div className={overrideRootClassName}>
            <div className={classes.tabsDiv}>
                <Tabs
                    value={currentIdx}
                    onChange={handleChangeTab}
                    indicatorColor="primary"
                    centered
                >
                    {tabList}
                </Tabs>
                {icon && (
                    <div className={classes.iconDiv}>
                        {typeof icon === 'string' ? (
                            <WmsIconButton onClick={onIconClick} icon={icon} />
                        ) : (
                            <WmsIconButton onClick={onIconClick}>{icon}</WmsIconButton>
                        )}
                    </div>
                )}
            </div>
            {swipeable && (
                <SwipeableViews
                    index={currentIdx}
                    onChangeIndex={handleChangeIndex}
                    className={clsx(classes.swipeableViews, overrideClassName)}
                >
                    {contentList}
                </SwipeableViews>
            )}
            {!swipeable && contentList[currentIdx]}
        </div>
    );
};

WmsTab.propTypes = {
    /**
     * 탭 object
     * { label, content }
     */
    tab: PropTypes.arrayOf(PropTypes.any).isRequired,
    tabWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.elementType]),
    onIconClick: PropTypes.func,
    swipeable: PropTypes.bool
};

WmsTab.defaultProps = {
    tabWidth: 0,
    icon: undefined,
    onIconClick: undefined,
    swipeable: true
};

export default WmsTab;
