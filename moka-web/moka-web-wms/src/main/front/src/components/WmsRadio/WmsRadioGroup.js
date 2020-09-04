import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import style from '~/assets/jss/components/WmsRadioStyle';

const useStyle = makeStyles(style);

/**
 * WMS Radio Group
 */
const WmsRadioGroup = (props) => {
    const {
        overrideRootClassName,
        overrideClassName,
        labelPlacement,
        disabled,
        components
    } = props;
    const { values, labels, currentId, name, onChange } = props;
    const classes = useStyle();

    return (
        <RadioGroup
            row
            aria-label={name}
            name={name}
            defaultValue="top"
            value={currentId}
            onChange={onChange}
            className={overrideRootClassName}
        >
            {values &&
                values.map((v, i) => (
                    <div key={v} className={classes.inLine}>
                        <FormControlLabel
                            value={v}
                            control={
                                <Radio
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked
                                    }}
                                    color="default"
                                />
                            }
                            label={labels[i]}
                            labelPlacement={labelPlacement}
                            className={overrideClassName}
                            disabled={disabled}
                        />
                        {components && components[i]}
                    </div>
                ))}
        </RadioGroup>
    );
};

WmsRadioGroup.propTypes = {
    values: PropTypes.arrayOf(PropTypes.any),
    labels: PropTypes.arrayOf(PropTypes.string),
    labelPlacement: PropTypes.string,
    /**
     * 라디오버튼 옆에 추가적인 컴포넌트 렌더링
     */
    components: PropTypes.arrayOf(PropTypes.any),
    currentId: PropTypes.string,
    name: PropTypes.string,
    overrideClassName: PropTypes.string,
    overrideRootClassName: PropTypes.string
};

WmsRadioGroup.defaultProps = {
    values: undefined,
    labels: undefined,
    labelPlacement: undefined,
    components: undefined,
    currentId: undefined,
    name: undefined,
    overrideClassName: undefined,
    overrideRootClassName: undefined
};

export default WmsRadioGroup;
