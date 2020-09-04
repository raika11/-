import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { WmsIconButton } from '~/components/WmsButtons';
import style from '~/assets/jss/pages/Reserved/ReservedListStyle';
import WmsCard from '../../components/WmsCard/index';
import ReservedSearchContainer from './ReservedSearchContainer';
import ReservedTableContainer from './ReservedTableContainer';

const useStyles = makeStyles(style);

const ReservedListContainer = (props) => {
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

    if (toggleState && toggle) {
        return (
            <>
                <WmsCard
                    title="예약어 검색"
                    action={
                        <WmsIconButton
                            overrideClassName={classes.reverseIcon}
                            onClick={handleOnToggle}
                            icon="double_arrow"
                        />
                    }
                >
                    <ReservedSearchContainer />
                    <ReservedTableContainer />
                </WmsCard>
            </>
        );
    }

    return <WmsCard action={<WmsIconButton onClick={handleOnToggle} icon="double_arrow" />} />;
};

export default ReservedListContainer;
