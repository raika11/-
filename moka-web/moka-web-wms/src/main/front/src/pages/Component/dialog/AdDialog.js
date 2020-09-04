import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsButton, WmsDraggableDialog } from '~/components';
import AdDialogSearch from './AdDialogSearch';
import AdDialogTable from './AdDialogTable';
import style from '~/assets/jss/pages/DialogStyle';

/**
 * Dialog Style
 */
const useStyle = makeStyles(style);

/**
 * 광고 다이얼로그
 * @param {boolean} props.open true | false
 * @param {func} props.onClose close함수
 */
const AdDialog = (props) => {
    const { open, onClose, onSave, componentAds, adIndex } = props;
    const classes = useStyle();
    const [adSeq, setAdSeq] = useState('');
    const [adName, setAdName] = useState('');

    /**
     * 등록 버튼
     */
    const onAdSave = () => {
        onSave({
            adSeq,
            adName
        });
        onClose();
    };

    useEffect(() => {
        const currentAd = componentAds[adIndex];
        if (currentAd) {
            setAdSeq(currentAd.ad.adSeq);
            setAdName(currentAd.ad.adName);
        }
    }, [adIndex, componentAds]);

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="광고 검색"
            maxWidth="md"
            content={
                <div className={clsx(classes.popupBody, classes.pl8, classes.pt8, classes.pr8)}>
                    <AdDialogSearch />
                    <AdDialogTable adSeq={adSeq} setAdSeq={setAdSeq} setAdName={setAdName} />
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    <WmsButton color="info" size="long" onClick={onAdSave}>
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

export default AdDialog;
