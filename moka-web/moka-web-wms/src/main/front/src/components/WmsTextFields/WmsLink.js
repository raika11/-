import React from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import style from '~/assets/jss/components/WmsTextFieldStyle';

const useStyle = makeStyles(style);

const WmsLink = (props) => {
    const { label, width, labelWidth, value, link, overrideClassName } = props;
    const classes = useStyle({ width, labelWidth });

    return (
        <div className={clsx(classes.form, overrideClassName)}>
            {label && (
                <Typography variant="subtitle1" className={classes.label} component="div">
                    {label}
                </Typography>
            )}
            <Typography
                variant="body1"
                className={clsx(classes.textField, classes.link)}
                component="div"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`${link}`);
                }}
            >
                {value}
            </Typography>
        </div>
    );
};

export default WmsLink;
