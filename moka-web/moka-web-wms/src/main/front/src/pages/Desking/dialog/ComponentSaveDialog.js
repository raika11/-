/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { WmsDialogAlert } from '~/components';
import { postComponentWork, hasOtherSaved } from '~/stores/desking/deskingStore';

const ComponentSaveDialog = ({ component, open, onClose }) => {
    const dispatch = useDispatch();
    const [saveOpen, setSaveOpen] = useState(false);
    const [relOpen, setRelOpen] = useState(false);
    const [modifier, setModifier] = useState('');

    useEffect(() => {
        if (open) {
            const option = {
                componentWorkSeq: component.seq,
                datasetSeq: component.datasetSeq,
                callback: (result) => {
                    if (result) {
                        setModifier(result);
                        setRelOpen(true);
                    } else {
                        setSaveOpen(true);
                    }
                }
            };
            dispatch(hasOtherSaved(option));
        }
    }, [open, dispatch, component]);

    // 종료
    const handleClose = (e, isYes) => {
        if (isYes && component) {
            const option = {
                componentWorkSeq: component.seq,
                callback: (result) => {
                    if (result) {
                        console.log(result);
                    }
                }
            };
            dispatch(postComponentWork(option));
        }

        if (saveOpen) setSaveOpen(false);
        if (relOpen) setRelOpen(false);

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
        <>
            {saveOpen && (
                <WmsDialogAlert title="전송" open={open} buttons={buttons} onClose={handleClose}>
                    <Typography component="p" variant="body1">
                        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                        선택하신 [{component.componentSeq}_{component.componentName}] 컴포넌트를 전송하시겠습니까?
                    </Typography>
                </WmsDialogAlert>
            )}

            {/* 다른 사용자 전송 O */}
            {relOpen && (
                <WmsDialogAlert
                    title="컴포넌트 시간차 경고"
                    open={relOpen}
                    buttons={buttons}
                    onClose={handleClose}
                >
                    <Typography component="p" variant="body1">
                        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                        선택하신 [{component.componentSeq}_{component.componentName}] 컴포넌트를 {modifier}님이 몇분전에 전송하셨습니다. 그래도 전송하시겠습니까?
                    </Typography>
                </WmsDialogAlert>
            )}
        </>
    );
};

export default ComponentSaveDialog;
