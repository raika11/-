import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import styles from '~/assets/jss/components/WmsSelectStyle';

const useStyles = makeStyles(styles);

const WmsSelect = ({
    rows,
    inputProps,
    name,
    currentId,
    onChange,
    disabled,
    color,
    width,
    overrideClassName,
    label,
    labelWidth,
    ...rest
}) => {
    const classes = useStyles({ width, labelWidth });
    return (
        <FormControl {...rest} variant="outlined" className={clsx(classes.root, overrideClassName)}>
            {label && (
                <Typography variant="body1" component="div" className={classes.label}>
                    {label}
                </Typography>
            )}
            <Select
                className={clsx(classes.selectField, classes[color])}
                native
                name={name}
                value={currentId || ''}
                onChange={onChange}
                inputProps={inputProps}
                disabled={disabled}
            >
                {rows &&
                    rows.length > 0 &&
                    rows.map((r) => (
                        <option
                            key={r.id}
                            value={r.id}
                            data-code-id={r.codeId}
                            data-code-name={r.codeName}
                            data-code-name-etc1={r.codeNameEtc1}
                            data-code-name-etc2={r.codeNameEtc2}
                        >
                            {r.name}
                        </option>
                    ))}
            </Select>
        </FormControl>
    );
};

WmsSelect.propTypes = {
    /**
     * 데이타
     */
    rows: PropTypes.arrayOf(PropTypes.object),
    /**
     * 선택된 아이디
     */
    currentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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

WmsSelect.defaultProps = {
    rows: null,
    currentId: null,
    onChange: null,
    disabled: false,
    className: undefined
};

export default WmsSelect;
