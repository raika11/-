import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextFieldIcon } from '~/components/WmsTextFields';
import autocompleteStyle from '~/assets/jss/components/WmsAutocompleteStyleBack';

const useStyles = makeStyles(autocompleteStyle);

export default function Tags(props) {
    const classes = useStyles();

    const {
        multiple,
        options,
        placeholder,
        label,
        overrideClassName,
        icon,
        required = false
    } = props;

    return (
        <div className={classes.root}>
            {required && <div className={classes.requiredData}>*</div>}
            <Autocomplete
                multiple={multiple}
                options={options}
                getOptionLabel={(option) => option.title}
                filterSelectedOptions
                renderInput={(params) => (
                    <WmsTextFieldIcon
                        {...params}
                        width="700"
                        placeholder={placeholder}
                        labelWidth="100"
                        variant="outlined"
                        label={label}
                        closeicon={icon && <Icon>{icon}</Icon>}
                        icon={icon}
                    />
                )}
                className={overrideClassName}
            />
        </div>
    );
}
