import React, { useEffect } from 'react';
import Search from './FbArtSearch';
import AgGrid from './FbArtAgGrid';
import { useDispatch, useSelector } from 'react-redux';
import { changeSnsSendArticleSearchOptions, GET_SNS_SEND_ARTICLE_LIST, getSnsSendArticleList, initialState } from '@store/snsManage';

const FbArtList = () => {
    const dispatch = useDispatch();
    const { search, list, total, totalId, loading } = useSelector((store) => ({
        search: store.sns.sendArticle.search,
        list: store.sns.sendArticle.list,
        total: store.sns.sendArticle.total,
        totalId: store.sns.meta.meta.totalId,
        loading: store.loading[GET_SNS_SEND_ARTICLE_LIST],
    }));

    const handleClickSearch = (options) => {
        dispatch(changeSnsSendArticleSearchOptions(options));
    };

    const handleClickReset = (callback) => {
        if (callback instanceof Function) {
            callback(initialState.sendArticle.search);
        }
        dispatch(changeSnsSendArticleSearchOptions(initialState.sendArticle.search));
    };

    useEffect(() => {
        dispatch(getSnsSendArticleList(search));
    }, [dispatch, search]);

    return (
        <>
            <Search searchOptions={search} onSearch={handleClickSearch} onReset={handleClickReset} />
            <AgGrid rows={list} searchOptions={search} total={total} selected={totalId} loading={loading} />
        </>
    );
};

export default FbArtList;
