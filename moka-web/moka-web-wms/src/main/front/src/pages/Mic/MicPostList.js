import React from 'react';
import { MokaCard } from '@/components';
import AgGrid from './MicPostListAgGrid';

const MicPostList = () => {
    return (
        <MokaCard title="포스트 목록" titleClassName="mb-0" className="w-100" bodyClassName="d-flex flex-column">
            <h1 className="mb-3 color-primary" as="h2">
                'Row Title'
            </h1>
            <AgGrid />
        </MokaCard>
    );
};

export default MicPostList;
