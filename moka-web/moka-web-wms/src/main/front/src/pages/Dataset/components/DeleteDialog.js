/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { WmsDialogAlert } from '~/components';
import { deleteDataset, hasRelations, getDatasetList } from '~/stores/dataset/datasetStore';

const DeleteDialog = ({ datasetSeq, datasetName, open, onClose }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [delOpen, setDelOpen] = useState(false);
    const [relOpen, setRelOpen] = useState(false);

    useEffect(() => {
        if (open) {
            const option = {
                datasetSeq,
                callback: (result) => {
                    return result ? setRelOpen(true) : setDelOpen(true);
                }
            };
            dispatch(hasRelations(option));
        }
    }, [open, dispatch, datasetSeq]);

    const handleOk = () => {
        if (datasetSeq) {
            const option = {
                datasetSeq,
                callback: (result) => {
                    if (result) {
                        dispatch(getDatasetList());
                        history.push('/dataset');
                    }
                }
            };
            dispatch(deleteDataset(option));
        }
    };

    return (
        <>
            {delOpen && (
                <WmsDialogAlert
                    title="데이타셋 삭제"
                    open={open}
                    type="delete"
                    onClose={() => {
                        setDelOpen(false);
                        onClose();
                    }}
                    okCallback={handleOk}
                >
                    <Typography component="p" variant="body1">
                        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                        선택하신 [{datasetSeq} : {datasetName}] 데이타셋을 삭제하시겠습니까?
                    </Typography>
                </WmsDialogAlert>
            )}

            {/* 관련 데이터 O */}
            {relOpen && (
                <WmsDialogAlert
                    title="데이타셋 삭제 오류"
                    open={relOpen}
                    type="show"
                    onClose={() => {
                        setRelOpen(false);
                        onClose();
                    }}
                >
                    <Typography component="p" variant="body1">
                        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                        선택하신 [{datasetSeq} : {datasetName}] 데이타셋이 사용 중이여서 삭제할 수 없습니다!
                    </Typography>
                </WmsDialogAlert>
            )}
        </>
    );
};

export default DeleteDialog;
