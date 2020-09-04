import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { deleteVolume, hasRelations } from '~/stores/volume/volumeStore';
import { WmsDialogAlert } from '~/components';

const DeleteDialog = (props) => {
    const { volumeId, volumeName, open, onClose } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const [delOpen, setDelOpen] = useState(false);
    const [relOpen, setRelOpen] = useState(false);

    useEffect(() => {
        if (open) {
            dispatch(
                hasRelations({
                    volumeId,
                    exist: () => setRelOpen(true),
                    notExist: () => setDelOpen(true)
                })
            );
        }
    }, [open, dispatch, volumeId]);
    return (
        <>
            {/* 관련 데이터가 없으면 */}
            <WmsDialogAlert
                title="볼륨 삭제"
                open={delOpen}
                type="delete"
                onClose={() => {
                    setDelOpen(false);
                    onClose();
                }}
                okCallback={() => {
                    dispatch(
                        deleteVolume({
                            volumeId,
                            success: () => history.push('/volume')
                        })
                    );
                }}
            >
                <Typography component="p" variant="body1">
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    선택하신 &apos;{volumeName}&apos; 볼륨을 삭제하시겠습니까?
                </Typography>
            </WmsDialogAlert>

            {/* 관련 데이터가 있으면 */}
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
                    선택하신 &apos;{volumeName}&apos; 볼륨에 아이템(템플릿, 컴포넌트 등)이
                    <br />
                    존재하여 삭제할 수 없습니다.
                </Typography>
            </WmsDialogAlert>
        </>
    );
};

export default DeleteDialog;
