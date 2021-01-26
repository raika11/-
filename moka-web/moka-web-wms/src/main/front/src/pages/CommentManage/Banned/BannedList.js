import React from 'react';
import { MokaCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { useSelector } from 'react-redux';

import BannedListBox from './BannedListBox';
import BannedListSearch from './BannedListSearch';

const BannedList = (props) => {
    // 상단 페이지 제목.
    const { pageName } = useSelector((store) => ({
        pageName: store.comment.banneds.pageName,
    }));

    return (
        <>
            <MokaCard
                className="mb-0 flex-fill"
                height={CARD_DEFAULT_HEIGHT}
                headerClassName="d-flex justify-content-between align-item-center"
                bodyClassName="d-flex flex-column"
                title={`${pageName}`}
                titleClassName="mb-0"
                minWidth={1360}
            >
                <BannedListSearch pathName={props.location.pathname} />
                <BannedListBox />
            </MokaCard>
        </>
    );
};

export default BannedList;
