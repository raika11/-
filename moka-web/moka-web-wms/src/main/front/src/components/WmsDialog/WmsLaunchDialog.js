import React from 'react';
import Typography from '@material-ui/core/Typography';
import { WmsDialogAlert } from '~/components';

const WmsLaunchDialog = (props) => {
    const { open, onClose, okCallback } = props;

    return (
        <WmsDialogAlert
            title="불러오기"
            open={open}
            type="confirm"
            onClose={onClose}
            okCallback={okCallback}
        >
            <Typography component="p" variant="body1">
                불러오기 시 작업 중인 템플릿 본문 내용이 날라갑니다.
            </Typography>
            <Typography component="p" variant="body1">
                불러오시겠습니까?
            </Typography>
        </WmsDialogAlert>
    );
};

export default WmsLaunchDialog;
