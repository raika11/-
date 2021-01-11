import React from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@/components';
import TourMonthCalendar from './TourMonthCalendar';

/**
 * 견학 월별 현황
 */
const TourMonth = () => {
    return (
        <>
            <Helmet>
                <title>월별 현황</title>
                <meta name="description" content="견학 월별 현황 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={1580} titleClassName="mb-0" title="월별 현황">
                <TourMonthCalendar />
            </MokaCard>
        </>
    );
};

export default TourMonth;
