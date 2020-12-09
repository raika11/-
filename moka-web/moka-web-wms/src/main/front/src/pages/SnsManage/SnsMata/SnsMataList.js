import React, { useEffect } from 'react';
import Search from './SnsMataSearch';
import AgGrid from './SnsMataAgGrid';
import { useDispatch, useSelector } from 'react-redux';
import { getSNSMetaList } from '@store/snsManage/snsAction';
import { GET_SNS_META_LIST } from '@store/snsManage';

const SnsMataList = () => {
    const dispatch = useDispatch();
    const { search, list, total, loading } = useSelector((store) => ({
        search: store.sns.meta.search,
        list: store.sns.meta.list,
        total: store.sns.meta.total,
        loading: store.loading[GET_SNS_META_LIST],
    }));

    useEffect(() => {
        dispatch(getSNSMetaList({ payload: search }));
    }, [dispatch, search]);

    return (
        <>
            <Search searchOptions={search} />
            <AgGrid rows={list} searchOptions={search} total={total} loading={loading} />
        </>
    );
};

export default SnsMataList;
