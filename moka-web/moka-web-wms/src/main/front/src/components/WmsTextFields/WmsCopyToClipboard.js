import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import Typography from '@material-ui/core/Typography';
import WmsTextFieldIcon from './WmsTextFieldIcon';
import { WmsDialogAlert } from '~/components';

/**
 * Copy to Clipboard
 * @param {object} props WmsTextFieldIcon로 전달할 Props
 */
const WmsCopyToClipboard = (props) => {
    const { value, ...rest } = props;
    const [open, setOpen] = useState(false);

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (value && value.length > 0) {
            copy(value);
            setOpen(true);
        }
    };

    return (
        <>
            <WmsTextFieldIcon
                {...rest}
                icon="insert_link"
                iconDisabled={!((value || false) && true)}
                disabled
                onIconClick={onClick}
                value={value}
            />
            <WmsDialogAlert
                open={open}
                type="show"
                title="알림창"
                onClose={() => setOpen(false)}
                okCallback={() => setOpen(false)}
            >
                <Typography component="p" variant="body1">
                    태그를 복사하였습니다.
                </Typography>
            </WmsDialogAlert>
        </>
    );
};

export default WmsCopyToClipboard;
