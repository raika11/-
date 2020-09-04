import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import styles from '~/assets/jss/components/WmsSwitchStyle';

const useStyles = makeStyles(styles);

const WmsSwitch = ({
    checked,
    onChange,
    name,
    inputProps,
    rows,
    width,
    overrideClassName,
    label,
    labelWidth,
    required,
    ...rest
}) => {
    const classes = useStyles({ width, labelWidth });

    return (
        <FormControl {...rest} variant="outlined" className={clsx(classes.root, overrideClassName)}>
            {label && (
                <Typography variant="subtitle1" component="div" className={classes.label}>
                    {label}
                    {required && <div className={classes.requiredData}>*</div>}
                </Typography>
            )}
            <Switch
                checked={checked}
                onChange={onChange}
                color="primary"
                name={name}
                inputProps={inputProps}
            />
        </FormControl>
    );
};

WmsSwitch.propTypes = {
    /**
     * 선택 변경 액션
     */
    onChange: PropTypes.func,
    /**
     * disable
     */
    disabled: PropTypes.bool,
    className: PropTypes.string
};

WmsSwitch.defaultProps = {
    rows: null,
    onChange: null,
    disabled: false,
    className: undefined
};

export default WmsSwitch;
