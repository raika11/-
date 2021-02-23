import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { MokaCard } from '@/components';
import { clearStore } from '@/store/tour';
import TourMonthCalendar from './TourMonthCalendar';

/**
 * 견학 월별 현황
 */
const TourMonth = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Helmet>
                <title>월별 현황</title>
                <meta name="description" content="견학 월별 현황 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={1596} title="월별 현황">
                <TourMonthCalendar />
            </MokaCard>
        </>
    );
};

export default TourMonth;
