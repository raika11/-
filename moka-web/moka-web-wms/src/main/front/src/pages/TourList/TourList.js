import React from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@/components';
import TourListApplyList from './TourListApplyList';

/**
 * 견학 신청목록
 */
const TourList = () => {
    return (
        <>
            <Helmet>
                <title>신청목록</title>
                <meta name="description" content="견학 신청목록 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="d-flex">
                <MokaCard width={790} titleClassName="mb-0" className="mr-gutter" title="신청 목록">
                    <TourListApplyList />
                </MokaCard>

                <MokaCard width={790} titleClassName="mb-0" title="견학 신청서">
                    {/* <TourSetEdit /> */}
                </MokaCard>
            </div>
        </>
    );
};

export default TourList;
