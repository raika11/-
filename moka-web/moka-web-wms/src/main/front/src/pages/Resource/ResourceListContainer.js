import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsIconButton } from '~/components/WmsButtons';
import style from '~/assets/jss/pages/Template/TemplateStyle';
import WmsCard from '../../components/WmsCard/index';

import ResourceSearch from './ResourceSearchContainer';
import ResourceTree from './ResourceTreeContainer';

const useStyles = makeStyles(style);

const ResourceListContainer = (props) => {
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
                title="리소스 검색"
                action={
                    <WmsIconButton
                        overrideClassName={clsx({ [classes.reverseIcon]: toggle })}
                        onClick={handleOnToggle}
                        icon="double_arrow"
                    />
                }
                overrideRootClassName={clsx({ [classes.hide]: !toggle })}
            >
                <ResourceSearch />
                <ResourceTree />
            </WmsCard>
        </>
    );
};

export default ResourceListContainer;
