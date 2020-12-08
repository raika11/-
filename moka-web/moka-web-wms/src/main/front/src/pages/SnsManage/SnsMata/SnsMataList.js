import React, { useEffect } from 'react';
import Search from './SnsMataSearch';
import AgGrid from './SnsMataAgGrid';
import { useDispatch, useSelector } from 'react-redux';
import { getSNSMetaList } from '@store/snsManage/snsAction';

const SnsMataList = () => {
    const dispatch = useDispatch();
    const { search, list, total } = useSelector((store) => ({
        search: store.sns.meta.search,
        list: store.sns.meta.list,
        total: store.sns.meta.total,
    }));

    useEffect(() => {
        dispatch(getSNSMetaList({ payload: search }));
    }, [dispatch, search]);

    return (
        <>
            <Search searchOptions={search} />
            <AgGrid rows={list} searchOptions={search} total={total} />
        </>
    );
};

export default SnsMataList;
