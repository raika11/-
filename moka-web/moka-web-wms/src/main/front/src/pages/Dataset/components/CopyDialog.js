import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { copyDataset, getDatasetList } from '~/stores/dataset/datasetStore';
import { WmsDialogAlert, WmsTextField } from '~/components';

const CopyDialog = (props) => {
    const { open, onClose, datasetSeq, datasetName } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const [copyName, setCopyName] = useState(`${datasetName}_복사`);

    const handleSave = () => {
        const option = {
            datasetSeq,
            datasetName: copyName,
            callback: (result) => {
                if (result) {
                    dispatch(getDatasetList());
                    history.push(`/dataset/${result.datasetSeq}`);
                }
                onClose();
            }
        };
        dispatch(copyDataset(option));
    };

    return (
        <WmsDialogAlert
            title="데이타셋 복사"
            open={open}
            type="alert"
            onClose={onClose}
            buttons={[
                { name: '저장', color: 'primary', onClick: handleSave },
                { name: '취소', onClick: onClose }
            ]}
        >
            <WmsTextField
                label="데이타셋명"
                labelWidth={70}
                value={copyName}
                fullWidth
                onChange={(e) => {
                    setCopyName(e.target.value);
                }}
            />
        </WmsDialogAlert>
    );
};

export default CopyDialog;
