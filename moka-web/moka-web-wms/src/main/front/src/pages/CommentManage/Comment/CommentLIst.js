import React, { useState } from 'react';
import { MokaCard } from '@components';

import CommentListBox from './CommentListBox';
import Search from './CommentSearch';

// 차단 목록 텝.
const CommentLIst = ({ matchPath }) => {
    const [selectBannedItem, setSelectBannedItem] = useState({
        id: [],
        ip: [],
    });

    return (
        <>
            <MokaCard className="w-100" bodyClassName="d-flex flex-column" title="댓글 관리">
                <Search selectBannedItem={selectBannedItem} setSelectBannedItem={setSelectBannedItem} />
                <CommentListBox matchPath={matchPath} selectBannedItem={selectBannedItem} setSelectBannedItem={setSelectBannedItem} />
            </MokaCard>
        </>
    );
};

export default CommentLIst;
