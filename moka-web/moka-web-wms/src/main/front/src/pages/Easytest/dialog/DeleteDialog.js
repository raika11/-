import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { WmsDialogAlert } from '~/components';

const DeleteDialog = (props) => {
    const { onClose } = props;
    const [relOpen, setRelOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);

    return (
        <>
            {/* 관련 아이템 없어서 삭제 */}
            <WmsDialogAlert
                title="템플릿 삭제"
                open={delOpen}
                type="delete"
                onClose={() => {
                    setDelOpen(false);
                    onClose();
                }}
            >
                <Typography component="p" variant="body1">
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    선택하신 템플릿을 삭제하시겠습니까?
                </Typography>
            </WmsDialogAlert>

            {/* 관련 아이템 있을 경우 */}
            <WmsDialogAlert
                title="확인"
                open={relOpen}
                type="show"
                onClose={() => {
                    setRelOpen(false);
                    onClose();
                }}
            >
                <Typography component="p" variant="body1">
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    선택하신 템플릿이 사용 중이여서 삭제할 수 없습니다.
                </Typography>
            </WmsDialogAlert>
        </>
    );
};

export default DeleteDialog;
