import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsSelect, WmsButton, WmsTable } from '~/components';
import { pageColumns } from '../components/tableColumns';
import style from '~/assets/jss/pages/RelationStyle';

const useStyles = makeStyles(style);

const EasytestRelationPS = () => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.mb8}>
                <WmsSelect fullWidth />
            </div>
            <div className={clsx(classes.button, classes.mb8)}>
                <WmsButton color="wolf" overrideClassName={classes.m0}>
                    <span>Test</span>
                </WmsButton>
                <WmsTable columns={pageColumns} />
            </div>
        </>
    );
};

export default EasytestRelationPS;
