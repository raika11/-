import React from 'react';
import Typography from '@material-ui/core/Typography';
import { WmsDialogAlert } from '~/components';

const ShowDialog = (props) => {
    const { open, onClose, message } = props;

    return (
        <WmsDialogAlert open={open} onClose={onClose} type="show">
            <Typography component="p" variant="body1">
                {message}
            </Typography>
        </WmsDialogAlert>
    );
};

export default ShowDialog;
