import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsButton, WmsDraggableDialog } from '~/components';
import SkinDialogSearch from './SkinDialogSearch';
import SkinDialogTable from './SkinDialogTable';
import style from '~/assets/jss/pages/DialogStyle';

/**
 * Dialog Style
 */
const useStyle = makeStyles(style);

/**
 * 본문스킨 다이얼로그
 * @param {boolean} props.open true | false
 * @param {func} props.onClose close함수
 * @param {func} props.setSkinSeq 스킨아이디 state 변경함수
 * @param {func} props.setSkinName 스킨명 state 변경함수
 */
const SkinDialog = (props) => {
    const { open, onClose, setSkinSeq, setSkinName } = props;
    const classes = useStyle();
    const [skinSeq, setLocalSkinSeq] = useState('');
    const [skinName, setLocalSkinName] = useState('');

    const onSave = () => {
        setSkinSeq(skinSeq);
        setSkinName(skinName);
        onClose();
    };

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="콘텐츠스킨 검색"
            maxWidth="sm"
            content={
                <div className={clsx(classes.popupBody, classes.pl8, classes.pt8, classes.pr8)}>
                    <SkinDialogSearch />
                    <SkinDialogTable
                        skinSeq={skinSeq}
                        setSkinSeq={setLocalSkinSeq}
                        setSkinName={setLocalSkinName}
                    />
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    <WmsButton color="info" size="long" onClick={onSave}>
                        등록
                    </WmsButton>
                    <WmsButton color="wolf" size="long" onClick={onClose}>
                        취소
                    </WmsButton>
                </div>
            }
        />
    );
};

export default SkinDialog;
