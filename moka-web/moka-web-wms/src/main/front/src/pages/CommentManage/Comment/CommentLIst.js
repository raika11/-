import React, { useState } from 'react';
import { MokaCard } from '@components';
import Search from './CommentSearch';
import CommentListBox from './CommentListBox';

/**
 * 댓글 관리 > 댓글 목록
 */
const CommentLIst = ({ matchPath }) => {
    const [selectBannedItem, setSelectBannedItem] = useState([]);

    return (
        <>
            <MokaCard className="w-100" bodyClassName="d-flex flex-column" title="댓글 목록">
                <Search selectBannedItem={selectBannedItem} setSelectBannedItem={setSelectBannedItem} />
                <CommentListBox matchPath={matchPath} selectBannedItem={selectBannedItem} setSelectBannedItem={setSelectBannedItem} />
            </MokaCard>
        </>
    );
};

export default CommentLIst;
