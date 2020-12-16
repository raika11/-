import React, { useEffect } from 'react';
import Search from './FbArtSearch';
import AgGrid from './FbArtAgGrid';
import { useDispatch, useSelector } from 'react-redux';
import { getSnsSendArticleList } from '@store/snsManage';

const FbArtList = () => {
    const dispatch = useDispatch();
    const { search, list, total } = useSelector((store) => ({
        search: store.sns.sendArticle.search,
        list: store.sns.sendArticle.list,
        total: store.sns.sendArticle.total,
    }));
    useEffect(() => {
        dispatch(getSnsSendArticleList(search));
    }, [dispatch, search]);

    return (
        <>
            <Search />
            <AgGrid rows={list} searchOptions={search} total={total} />
        </>
    );
};

export default FbArtList;
