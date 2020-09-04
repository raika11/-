import React from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { WmsIconButton } from '~/components';
import { deleteDeskingRelWork } from '~/stores/desking/deskingStore';

/**
 * 데스킹 수정폼 오른쪽 > 관련기사 태그
 * @param {number} props.index 현재 관련기사의 index
 * @param {object} props.classes 스타일
 * @param {object} props.component 현재 컴포넌트 워크 데이터
 * @param {object} props.workData 현재 워크 데이터
 * @param {object} props.currentData 현재 관련기사 워크데이터
 */
const RelationArticleTag = (props) => {
    const { classes, component, workData, currentData } = props;
    const dispatch = useDispatch();

    const onClick = () => {
        dispatch(
            deleteDeskingRelWork({
                componentWorkSeq: component.seq,
                deskingWork: workData,
                deskingRelWork: currentData
            })
        );
    };

    return (
        <div className={clsx(classes.inLine, classes.infoRightRelTag)}>
            <Typography component="p" variant="body1">
                {currentData.relTitle}
            </Typography>
            <WmsIconButton onClick={onClick}>
                <RemoveCircleIcon />
            </WmsIconButton>
        </div>
    );
};

export default RelationArticleTag;
