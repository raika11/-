import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsIconButton, WmsCard } from '~/components';
import style from '~/assets/jss/pages/Component/ComponentStyle';

import ComponentSearch from './ComponentSearchContainer';
import ComponentTable from './ComponentTableContainer';

const useStyles = makeStyles(style);

const ComponentListContainer = (props) => {
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
        <>
            <WmsCard
                title="컴포넌트 검색"
                action={
                    <WmsIconButton
                        overrideClassName={clsx({ [classes.reverseIcon]: toggle })}
                        onClick={handleOnToggle}
                        icon="double_arrow"
                    />
                }
                overrideRootClassName={clsx({ [classes.listHide]: !toggle })}
            >
                <ComponentSearch />
                <ComponentTable />
            </WmsCard>
        </>
    );
};

export default ComponentListContainer;
