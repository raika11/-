import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { clearStore } from '@store/tour';
import HolidayList from './HolidayList';
import TourSetEdit from './TourSetEdit';

/**
 * 견학 > 기본 설정
 */
const TourSet = ({ displayName }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="d-flex">
                <Helmet>
                    <title>{displayName}</title>
                    <meta name="description" content={`견학 ${displayName} 페이지입니다.`} />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 휴일 지정 목록 */}
                <HolidayList />

                {/* 견학 기본 설정 */}
                <TourSetEdit />
            </div>
        </>
    );
};

export default TourSet;
