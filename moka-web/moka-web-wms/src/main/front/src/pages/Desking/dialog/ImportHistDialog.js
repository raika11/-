/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { WmsDialogAlert } from '~/components';
import { postDeskingHistories } from '~/stores/desking/deskingHistoryStore';

const ImportHistDialog = (props) => {
    const { open, onClose, datasetSeq, histCreator, histCreateYmdt } = props;
    let { componentWorkSeq } = props;
    const deskingList = useSelector((store) => store.deskingStore.list);
    const dispatch = useDispatch();

    // 종료
    const handleClose = (e, isYes) => {
        if (isYes && datasetSeq) {
            if (!componentWorkSeq) {
                const findComp = deskingList.filter((d) => d.datasetSeq === datasetSeq);
                if (findComp.length > 0) {
                    componentWorkSeq = findComp[0].seq;
                }
            }
            const option = {
                componentWorkSeq,
                search: {
                    creator: histCreator,
                    createYmdt: histCreateYmdt,
                    datasetSeq
                }
            };
            dispatch(postDeskingHistories(option));
        }

        onClose(isYes);
    };

    // 버튼
    let buttons = [];
    buttons.push({
        name: '예',
        color: 'primary',
        onClick(e) {
            e.preventDefault();
            e.stopPropagation();
            handleClose(e, true);
        }
    });
    buttons.push({
        name: '아니오',
        color: 'default',
        onClick(e) {
            e.preventDefault();
            e.stopPropagation();
            handleClose(e, false);
        }
    });

    return (
        <WmsDialogAlert title="불러오기" open={open} buttons={buttons} onClose={handleClose}>
            <Typography component="p" variant="body1">
                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                기존에 작업하신 내역은 지워집니다. 히스토리를 불러오시겠습니까?
            </Typography>
        </WmsDialogAlert>
    );
};

export default ImportHistDialog;
