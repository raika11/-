import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { WmsIconButton, WmsMessageBox } from '~/components';
import { deleteDataset } from '~/stores/dataset/datasetStore';

/**
 * 데이타셋목록에서 삭제 버튼
 * @param {} param
 */
const DatasetListDeleteButton = (props) => {
    const dispatch = useDispatch();

    // 데이타셋 삭제
    const handleClickDelete = useCallback(() => {
        const { data, history } = props;
        // props.context.componentParent
        if (data && data.datasetSeq) {
            WmsMessageBox.confirm('삭제하시겠습니까?', () => {
                const option = {
                    datasetSeq: data.datasetSeq,
                    callback: (result) => {
                        if (result) {
                            history.push('/test');
                        }
                    }
                };
                dispatch(deleteDataset(option));
            });
        }
    }, [dispatch, props]);

    return (
        <WmsIconButton
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleClickDelete();
            }}
        >
            <RemoveCircleIcon />
        </WmsIconButton>
    );
};

export default withRouter(DatasetListDeleteButton);
