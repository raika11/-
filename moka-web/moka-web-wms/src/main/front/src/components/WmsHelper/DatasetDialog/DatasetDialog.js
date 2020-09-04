import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { WmsButton, WmsDraggableDialog } from '~/components';
import style from '~/assets/jss/pages/DialogStyle';
import DatasetDialogSearch from './DatasetDialogSearch';
import DatasetDialogTable from './DatasetDialogTable';

const useStyle = makeStyles(style);

const DatasetDialog = (props) => {
    const classes = useStyle();
    const { open, onClose, onSave } = props;
    const [radioSelectedRow, setRadioSelectedRow] = useState([]); // 라디오 선택목록

    // 등록버튼 클릭
    const handleSelect = useCallback(() => {
        if (radioSelectedRow.length > 0) {
            onSave(radioSelectedRow[0]);
        }
        onClose();
    }, [onClose, onSave, radioSelectedRow]);

    // 라디오 선택
    const handeChangeRadio = useCallback((row) => {
        setRadioSelectedRow(row);
    }, []);

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="데이터셋 검색"
            maxWidth="sm"
            content={
                <div className={clsx(classes.popupBody, classes.ml8, classes.mt8, classes.mr8)}>
                    <DatasetDialogSearch />
                    <DatasetDialogTable onChangeRadio={handeChangeRadio} />
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    <WmsButton color="info" size="long" onClick={handleSelect}>
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
