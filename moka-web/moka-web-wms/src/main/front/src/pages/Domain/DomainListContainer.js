import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsCard, WmsIconButton } from '~/components';
import style from '~/assets/jss/pages/Domain/DomainStyle';

import DomainTableContainer from './DomainTableContainer';

const useStyles = makeStyles(style);

const DomainListContainer = (props) => {
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
            title="도메인 관리"
            action={
                <WmsIconButton
                    overrideClassName={clsx({ [classes.reverseIcon]: toggle })}
                    onClick={handleOnToggle}
                    icon="double_arrow"
                />
            }
            overrideRootClassName={clsx({ [classes.listHide]: !toggle })}
        >
            <DomainTableContainer />
        </WmsCard>
    );
};

export default DomainListContainer;
