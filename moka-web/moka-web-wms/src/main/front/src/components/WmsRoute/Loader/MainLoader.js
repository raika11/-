import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { WmsLoader } from '~/components';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        height: 871,
        width: '100%',
        '& > .MuiPaper-root': { backgroundColor: 'transparent' }
    }
}));

const MainLoader = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <WmsLoader />
        </div>
    );
};

export default MainLoader;
