import React, { useEffect, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import ReporterDeskSearch from './ReporterDeskSearch';
import ReporterDeskAgGrid from './ReporterDeskAgGrid';
import { clearList, clearSearch } from '@store/article';

/**
 * 페이지편집 > 기자 리스트 (추후작업)
 */
const ReporterDeskList = forwardRef((props, ref) => {
    const { className } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            // unmount
            dispatch(clearList());
            dispatch(clearSearch());
        };
    }, [dispatch]);

    return (
        <div className={className}>
            <ReporterDeskSearch />
            <ReporterDeskAgGrid ref={ref} />
        </div>
    );
});

export default ReporterDeskList;
