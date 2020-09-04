import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsIconButton, WmsCard } from '~/components';
import style from '~/assets/jss/pages/Template/TemplateStyle';

import TemplateSearch from './TemplateSearchContainer';
import TemplateTable from './TemplateTableContainer';

const useStyles = makeStyles(style);

/**
 * 템플릿 리스트
 * @param {array} props.toggleState 컬럼별 toggle state
 * @param {func} props.changeToggleState toggle state 변경
 */
const TemplateListContainer = (props) => {
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
            title="템플릿 검색"
            action={
                <WmsIconButton
                    overrideClassName={clsx({ [classes.reverseIcon]: toggle })}
                    onClick={handleOnToggle}
                    icon="double_arrow"
                />
            }
            overrideRootClassName={clsx({ [classes.listHide]: !toggle })}
        >
            <TemplateSearch />
            <TemplateTable />
        </WmsCard>
    );
};

export default TemplateListContainer;
