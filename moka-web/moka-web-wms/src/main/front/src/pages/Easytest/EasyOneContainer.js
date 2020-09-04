import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsCard, WmsIconButton } from '~/components';
import style from '~/assets/jss/pages/Easytest/EasytestStyle';

import EasySearch from './EasySearchContainer';
import EasyTable from './EasyTableContainer';

const useStyles = makeStyles(style);

const EasyOneContainer = (props) => {
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
            title="테스트 페이지"
            action={
                <WmsIconButton
                    overrideClassName={clsx({ [classes.reverseIcon]: toggle })}
                    onClick={handleOnToggle}
                    icon="double_arrow"
                />
            }
            overrideRootClassName={clsx({ [classes.listHide]: !toggle })}
        >
            <EasySearch />
        </WmsCard>
    );
};

export default EasyOneContainer;
