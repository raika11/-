import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { WmsDialogAlert } from '~/components';
import { deleteContainer, hasRelations, getContainerList } from '~/stores/container/containerStore';

const DeleteDialog = ({ containerSeq, containerName, open, onClose }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [delOpen, setDelOpen] = useState(false);
    const [relOpen, setRelOpen] = useState(false);

    useEffect(() => {
        if (open) {
            const option = {
                containerSeq,
                callback: (result) => {
                    return result ? setRelOpen(true) : setDelOpen(true);
                }
            };
            dispatch(hasRelations(option));
        }
    }, [open, dispatch, containerSeq]);

    const handleOk = () => {
        if (containerSeq) {
            const option = {
                containerSeq,
                callback: (result) => {
                    if (result) {
                        dispatch(getContainerList());
                        history.push('/container');
                    }
                }
            };
            dispatch(deleteContainer(option));
        }
    };

    return (
        <>
            {delOpen && (
                <WmsDialogAlert
                    title="컨테이너 삭제"
                    open={open}
                    type="delete"
                    onClose={onClose}
                    okCallback={handleOk}
                >
                    <Typography component="p" variant="body1">
                        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                        선택하신 [{containerSeq} : {containerName}] 컨테이너를 삭제하시겠습니까?
                    </Typography>
                </WmsDialogAlert>
            )}

            {/* 관련 데이터 O */}
            {relOpen && (
                <WmsDialogAlert
                    title="컨테이너 삭제 오류"
                    open={relOpen}
                    type="show"
                    onClose={() => {
                        setRelOpen(false);
                        onClose();
                    }}
                >
                    <Typography component="p" variant="body1">
                        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                        선택하신 [{containerSeq} : {containerName}] 컨테이너가 사용 중이여서 삭제할 수 없습니다!
                    </Typography>
                </WmsDialogAlert>
            )}
        </>
    );
};

export default DeleteDialog;
