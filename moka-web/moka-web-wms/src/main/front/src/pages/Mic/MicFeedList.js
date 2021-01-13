import React from 'react';
import { MokaCard } from '@/components';
import AgGrid from './MicFeedListAgGrid';

const MicFeedList = (props) => {
    return (
        <MokaCard title="피드 목록" titleClassName="mb-0" className="w-100" bodyClassName="d-flex flex-column">
            <h1 className="color-primary" as="h2">
                'Row Title'
            </h1>
            <AgGrid />
        </MokaCard>
    );
};

export default MicFeedList;
