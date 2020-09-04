import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsIconButton, WmsCard } from '~/components';
import style from '~/assets/jss/pages/Page/PageStyle';
import PageSearchContainer from './PageSearchContainer';
import PageTreeContainer from './PageTreeContainer';

const useStyles = makeStyles(style);

const PageManagementContainer = (props) => {
    const { toggleState, changeToggleState } = props;
    const classes = useStyles();
    const [toggle, setToggle] = useState(false);

    const handleOnToggle = () => {
        changeToggleState(0, !toggle);
        setToggle(!toggle);
    };

    useEffect(() => {
        if (toggleState) {
            setToggle(toggleState[0]);
        }
    }, [toggleState]);

    return (
        <WmsCard
            title="페이지 검색"
            action={
                <WmsIconButton
                    overrideClassName={clsx({ [classes.reverseIcon]: toggle })}
                    onClick={handleOnToggle}
                    icon="double_arrow"
                />
            }
            overrideRootClassName={clsx({ [classes.listHide]: !toggle })}
        >
            <PageSearchContainer />
            <PageTreeContainer />
        </WmsCard>
    );
};

export default PageManagementContainer;
