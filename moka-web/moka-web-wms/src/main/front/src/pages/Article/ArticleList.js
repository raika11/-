import React, { useEffect, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import ArticleSearch from './ArticleSearch';
import ArticleAgGrid from './ArticleAgGrid';
import { clearList, clearSearch } from '@store/article';

const ArticleList = forwardRef(({ className }, ref) => {
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
            <ArticleSearch />
            <ArticleAgGrid ref={ref} />
        </div>
    );
});

export default ArticleList;
