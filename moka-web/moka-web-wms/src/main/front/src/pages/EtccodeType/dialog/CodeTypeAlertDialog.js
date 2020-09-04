import React from 'react';
import Typography from '@material-ui/core/Typography';
import { WmsDialogAlert } from '~/components';

const CodeTypeAlertDialog = (props) => {
    const { open, onClose } = props;

    return (
        <WmsDialogAlert title="코드그룹 미선택" open={open} type="show" onClose={onClose}>
            <Typography component="p" variant="body1">
                코드그룹을 선택하세요
            </Typography>
        </WmsDialogAlert>
    );
};

export default CodeTypeAlertDialog;
