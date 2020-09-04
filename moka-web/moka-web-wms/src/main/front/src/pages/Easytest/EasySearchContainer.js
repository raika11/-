import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsSelect, WmsTextFieldIcon } from '~/components';
import style from '~/assets/jss/pages/Easytest/EasytestStyle';

const useStyle = makeStyles(style);

const EasySearchContainer = () => {
    const classes = useStyle();
    return (
        <div className={clsx(classes.listSearchRoot, classes.mb8)}>
            <>
                <WmsSelect fullWidth overrideClassName={classes.mb8} />
            </>
            <>
                <WmsSelect width={227} overrideClassName={clsx(classes.mb8, classes.mr8)} />
                <WmsSelect width="calc(100% - 235px)" overrideClassName={classes.mb8} />
            </>
            <>
                <WmsSelect width={166} overrideClassName={classes.mr8} />
                <WmsTextFieldIcon
                    placeholder="검색어를 입력하세요."
                    width="calc(100% - 174px)"
                    icon="search"
                />
            </>
        </div>
    );
};

export default EasySearchContainer;
