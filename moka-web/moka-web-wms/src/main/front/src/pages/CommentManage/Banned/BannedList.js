import React from 'react';
import { MokaCard } from '@components';
import BannedListGrid from './BannedListGrid';
import BannedListSearch from './BannedListSearch';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { useSelector } from 'react-redux';

const BannedList = () => {
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
                <BannedListSearch />
                <BannedListGrid />
            </MokaCard>
        </>
    );
};

export default BannedList;
