import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import style from '~/assets/jss/components/WmsButtons/WmsOutlinedButtonStyle';

const useStyle = makeStyles(style);

const WmsOutlinedButton = (props) => {
    const { children, overrideClassName, color, ...rest } = props;
    const classes = useStyle();

    return (
        <Button
            {...rest}
            variant="outlined"
            classes={{
                root: clsx(classes.root, { [classes[color]]: color }, overrideClassName),
                label: classes.label
            }}
            disableElevation
        >
            {children}
        </Button>
    );
};

export default WmsOutlinedButton;
