import React, { useEffect, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import ArticleSearch from './ArticleSearch';
import ArticleAgGrid from './ArticleAgGrid';
import { clearList, clearSearch } from '@store/article';

const ArticleList = forwardRef((props, ref) => {
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
            <ArticleSearch video={video} />
            <ArticleAgGrid ref={ref} />
        </div>
    );
});

export default ArticleList;
