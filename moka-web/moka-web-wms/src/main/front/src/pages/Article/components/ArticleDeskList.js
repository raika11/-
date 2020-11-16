import React, { useEffect, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import ArticleDeskSearch from './ArticleDeskSearch';
import ArticleDeskAgGrid from './ArticleDeskAgGrid';
import { clearList, clearSearch } from '@store/article';

/**
 * 페이지편집 > 기사리스트
 */
const ArticleDeskList = forwardRef((props, ref) => {
    const { className, video } = props;
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
            <ArticleDeskSearch video={video} />
            <ArticleDeskAgGrid ref={ref} />
        </div>
    );
});

export default ArticleDeskList;
