import React, { useEffect } from 'react';
import SEOMetaSearch from '@pages/SEOMeta/SEOMetaSearch';
import SEOMetaAgGrid from '@pages/SEOMeta/SEOMetaAgGrid';
import { useDispatch, useSelector } from 'react-redux';
import { changeSeoMetaSearchOptions, getSeoMetaList, initialState, GET_SEO_META_LIST } from '@store/seoMeta';

const SEOMetaList = () => {
    const dispatch = useDispatch();
    const { list, search, total, totalId, loading } = useSelector((store) => ({
        list: store.seoMeta.list,
        search: store.seoMeta.search,
        total: store.seoMeta.total,
        totalId: store.seoMeta.seoMeta.totalId,
        loading: store.loading[GET_SEO_META_LIST],
    }));

    const handleChangeSearchOption = (options) => {
        dispatch(changeSeoMetaSearchOptions(options));
    };

    const handleClickReset = (callback) => {
        if (callback instanceof Function) {
            callback(initialState.search);
        }
        handleChangeSearchOption(initialState.search);
    };

    useEffect(() => {
        dispatch(getSeoMetaList(search));
    }, [dispatch, search]);

    return (
        <>
            <SEOMetaSearch searchOptions={search} onSearch={handleChangeSearchOption} onReset={handleClickReset} />
            <SEOMetaAgGrid rows={list} searchOptions={search} total={total} selected={totalId} loading={loading} onChangeSearchOption={handleChangeSearchOption} />
        </>
    );
};

export default SEOMetaList;
