import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsIconButton } from '~/components/WmsButtons';
import style from '~/assets/jss/pages/Container/ContainerStyle';
import WmsCard from '../../components/WmsCard/index';
import ContainerSearch from './ContainerSearchContainer';
import ContainerTable from './ContainerTableContainer';

const useStyles = makeStyles(style);

const ContainerListContainer = (props) => {
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
                title="컨테이너 검색"
                action={
                    <WmsIconButton
                        overrideClassName={clsx({ [classes.reverseIcon]: toggle })}
                        onClick={handleOnToggle}
                        icon="double_arrow"
                    />
                }
                overrideRootClassName={clsx({ [classes.listHide]: !toggle })}
            >
                <ContainerSearch />
                <ContainerTable />
            </WmsCard>
        </>
    );
};

export default ContainerListContainer;
