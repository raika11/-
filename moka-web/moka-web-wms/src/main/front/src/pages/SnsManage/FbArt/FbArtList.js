import React, { useEffect } from 'react';
import Search from './FbArtSearch';
import AgGrid from './FbArtAgGrid';
import { useDispatch, useSelector } from 'react-redux';
import { getSnsSendArticleList } from '@store/snsManage';

const FbArtList = () => {
    const dispatch = useDispatch();
    const { search, list, total, totalId } = useSelector((store) => ({
        search: store.sns.sendArticle.search,
        list: store.sns.sendArticle.list,
        total: store.sns.sendArticle.total,
        totalId: store.sns.meta.meta.totalId,
    }));
    useEffect(() => {
        dispatch(getSnsSendArticleList(search));
    }, [dispatch, search]);

    return (
        <>
            <Search searchOptions={search} />
            <AgGrid rows={list} searchOptions={search} total={total} selected={totalId} />
        </>
    );
};

export default FbArtList;
