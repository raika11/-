import React from 'react';
import clsx from 'clsx';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import style from '~/assets/jss/components/WmsButtons/WmsToggleButtonStyle';

const useStyle = makeStyles(style);

const WmsToggleButton = (props) => {
    const { children, icon, square, overrideClassName, selected, color, ...rest } = props;
    const classes = useStyle();

    return (
        <ToggleButton
            centerRipple
            disableFocusRipple
            {...rest}
            classes={{
                selected: classes.selected,
                disabled: classes.disabled
            }}
            className={clsx(
                classes.root,
                { [classes.square]: square, [classes[color]]: color },
                overrideClassName
            )}
            selected={selected}
            size="small"
        >
            {icon && <Icon>{icon}</Icon>}
            {!icon && children}
        </ToggleButton>
    );
};

export default WmsToggleButton;
