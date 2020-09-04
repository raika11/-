import React, { useCallback } from 'react';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { WmsIconButton } from '~/components';

/**
 * 관련기사 삭제
 * @param {object} props Props
 */
const RelationArticleListDeleteButton = (props) => {
    const { api, node } = props;

    // 삭제
    const handleClickDelete = useCallback(() => {
        api.applyTransaction({
            remove: [node.data]
        });
    }, [api, node]);

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

export default RelationArticleListDeleteButton;
