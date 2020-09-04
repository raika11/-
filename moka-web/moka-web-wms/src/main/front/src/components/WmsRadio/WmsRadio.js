import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

/**
 * WMS Radio
 */
const WmsRadio = (props) => {
    const { value, label, overrideClassName, labelPlacement, control } = props;

    return (
        <FormControl component="fieldset">
            <RadioGroup row aria-label="position" name="position" defaultValue="top">
                <FormControlLabel
                    value={value}
                    label={label}
                    control={<Radio color={control} />}
                    labelPlacement={labelPlacement}
                    className={overrideClassName}
                />
            </RadioGroup>
        </FormControl>
    );
};

WmsRadio.propTypes = {
    // 버튼 색상
    control: PropTypes.oneOf([
        'primary',
        'secondary',
        'success',
        'info',
        'warning',
        'wolf',
        'error',
        'transparent',
        'del'
    ]),
    value: PropTypes.any,
    label: PropTypes.string,
    labelPlacement: PropTypes.string,
    // 기존 클래스명
    className: PropTypes.string
};

WmsRadio.defaultProps = {
    value: undefined,
    label: undefined,
    labelPlacement: undefined,
    control: undefined,
    className: undefined
};

export default WmsRadio;
