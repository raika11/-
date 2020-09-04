import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsButton, WmsDraggableDialog } from '~/components';
import DatasetDialogSearch from './DatasetDialogSearch';
import DatasetDialogTable from './DatasetDialogTable';
import style from '~/assets/jss/pages/DialogStyle';

/**
 * Dialog Style
 */
const useStyle = makeStyles(style);

/**
 * 데이터셋 다이얼로그
 * @param {boolean} props.open true | false
 * @param {func} props.onClose close함수
 * @param {func} props.setDatasetName 데이터명 state 변경함수
 * @param {func} props.setDatasetSeq 데이터아이디 state 변경함수
 * @param {func} props.setDataType 데이터타입 state 변경함수
 */
const DatasetDialog = (props) => {
    const { open, onClose, setDatasetSeq, setDatasetName, setDataType } = props;
    const classes = useStyle();
    const [datasetSeq, setLocalDatasetSeq] = useState('');
    const [datasetName, setLocalDatasetName] = useState('');

    /**
     * 등록 버튼
     */
    const onSave = () => {
        setDataType('AUTO');
        setDatasetSeq(datasetSeq);
        setDatasetName(datasetName);
        onClose();
    };

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="데이터셋 검색"
            maxWidth="sm"
            content={
                <div className={clsx(classes.popupBody, classes.pl8, classes.pt8, classes.pr8)}>
                    <DatasetDialogSearch />
                    <DatasetDialogTable
                        datasetSeq={datasetSeq}
                        setDatasetSeq={setLocalDatasetSeq}
                        setDatasetName={setLocalDatasetName}
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

export default DatasetDialog;
