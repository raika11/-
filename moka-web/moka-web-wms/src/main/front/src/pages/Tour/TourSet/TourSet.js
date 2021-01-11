import React from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@/components';
import HolidayList from './HolidayList';
import TourSetEdit from './TourSetEdit';

/**
 * 견학 기본설정
 */
const TourSet = () => {
    return (
        <>
            <div className="d-flex">
                <Helmet>
                    <title>기본설정</title>
                    <meta name="description" content="견학 기본설정 페이지입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 휴일 지정 목록 */}
                <MokaCard width={790} titleClassName="mb-0" className="mr-gutter" title="휴일 지정(매년 반복)">
                    <HolidayList />
                </MokaCard>

                {/* 견학 기본설정 */}
                <MokaCard width={790} titleClassName="mb-0" title="견학 기본설정">
                    <TourSetEdit />
                </MokaCard>
            </div>
        </>
    );
};

export default TourSet;
