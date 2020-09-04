import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        display: 'block',
        overflow: 'hidden',
        backgroundColor: theme.palette.basic.etc[2]
    }
}));

const SidebarLoader = () => {
    const classes = useStyle();
    return <div className={classes.root}></div>;
};

export default SidebarLoader;
