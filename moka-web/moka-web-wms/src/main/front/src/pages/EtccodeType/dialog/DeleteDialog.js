import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { deleteEtccodeType } from '~/stores/etccodeType/etccodeTypeStore';

import { WmsDialogAlert } from '~/components';

const DeleteDialog = (props) => {
    const { codeTypeSeq, open, onClose } = props;
    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <WmsDialogAlert
            title="코드그룹 삭제"
            open={open}
            type="delete"
            onClose={onClose}
            okCallback={() => {
                dispatch(
                    deleteEtccodeType({
                        codeTypeSeq,
                        callback: () => history.push('/etccodeType')
                    })
                );
            }}
        >
            <Typography component="p" variant="body1">
                선택하신 코드그룹의 하위 코드도 전부 삭제됩니다.
            </Typography>
            <Typography component="p" variant="body1">
                코드그룹을 삭제하시겠습니까?
            </Typography>
        </WmsDialogAlert>
    );
};

export default DeleteDialog;
