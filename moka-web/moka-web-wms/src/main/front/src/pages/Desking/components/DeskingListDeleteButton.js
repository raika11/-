import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { WmsIconButton } from '~/components';
import { deleteDeskingWorkList } from '~/stores/desking/deskingStore';

/**
 * 목록에서 삭제 버튼
 * @param {} param
 */
const DeskingListDeleteButton = ({ params }) => {
    const dispatch = useDispatch();

    // 삭제
    const handleClickDelete = useCallback(() => {
        const option = {
            componentWorkSeq: params.node.data.componentWorkSeq,
            datasetSeq: params.node.data.datasetSeq,
            list: [params.node.data],
            noMessage: true
        };
        dispatch(deleteDeskingWorkList(option));

        // const { data, history } = props;
        // props.context.componentParent
        // if (data && data.datasetSeq) {
        //     WmsMessageBox.confirm('삭제하시겠습니까?', () => {
        //         dispatch(deleteDeskingWorkList({ datasetSeq: data.datasetSeq, history }));
        //         // history.push('/desking');
        //     });
        // }
    }, [dispatch, params.node.data]);

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

export default withRouter(DeskingListDeleteButton);
