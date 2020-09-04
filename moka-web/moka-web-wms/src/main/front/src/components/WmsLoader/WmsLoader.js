import React from 'react';
import { BeatLoader } from 'react-spinners';
import clsx from 'clsx';
import { Paper } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import WmsLoaderStyle from '~/assets/jss/components/WmsLoaderStyle';

/**
 * Wms Loader Style
 */
const useStyle = makeStyles(WmsLoaderStyle);

/**
 * Wms Loader
 */
const WmsLoader = (props) => {
    const { overrideClassName, size } = props;
    const classes = useStyle();
    const theme = useTheme();

    return (
        <Paper square elevation={0} className={clsx(classes.root, overrideClassName)}>
            <BeatLoader size={size} margin={5} color={theme.palette.basic.main} />
        </Paper>
    );
};

export default WmsLoader;
