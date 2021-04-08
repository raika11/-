import React, { useEffect } from 'react';
import Search from './SnsMetaSearch';
import AgGrid from './SnsMetaAgGrid';
import { useDispatch, useSelector } from 'react-redux';
import { changeSnsMetaSearchOptions, getSnsMetaList } from '@store/snsManage/snsAction';
import { GET_SNS_META_LIST, initialState } from '@store/snsManage';

const SnsMetaList = () => {
    const dispatch = useDispatch();
    const { search, list, total, loading, totalId } = useSelector((store) => ({
        search: store.sns.meta.search,
        list: store.sns.meta.list,
        total: store.sns.meta.total,
        totalId: store.sns.meta.meta.totalId,
        loading: store.loading[GET_SNS_META_LIST],
    }));

    const handleClickSearch = (options) => {
        dispatch(changeSnsMetaSearchOptions(options));
    };

    const handleClickReset = (callback) => {
        if (callback instanceof Function) {
            callback(initialState.meta.search);
        }
        //dispatch(changeSnsMetaSearchOptions(initialState.meta.search));
    };

    useEffect(() => {
        dispatch(getSnsMetaList({ payload: search }));
    }, [dispatch, search]);

    return (
        <>
            <Search searchOptions={search} onSearch={handleClickSearch} onReset={handleClickReset} />
            <AgGrid rows={list} searchOptions={search} total={total} loading={loading} selected={totalId} />
        </>
    );
};

export default SnsMetaList;
