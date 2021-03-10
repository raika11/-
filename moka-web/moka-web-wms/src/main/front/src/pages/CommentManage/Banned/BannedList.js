import React from 'react';
import { MokaCard } from '@components';
import { useSelector } from 'react-redux';
import BannedListBox from './BannedListBox';
import BannedListSearch from './BannedListSearch';

/**
 * 댓글 관리 > 차단 목록
 */
const BannedList = ({ match }) => {
    // 상단 페이지 제목.
    const { pageName } = useSelector((store) => ({
        pageName: store.comment.banneds.pageName,
    }));

    return (
        <>
            <MokaCard className="w-100" title={`${pageName}`} headerClassName="d-flex justify-content-between align-item-center" bodyClassName="d-flex flex-column">
                <BannedListSearch match={match} />
                <BannedListBox />
            </MokaCard>
        </>
    );
};

export default BannedList;
