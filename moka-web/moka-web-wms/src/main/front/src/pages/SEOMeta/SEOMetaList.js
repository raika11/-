import React, { useEffect } from 'react';
import SEOMetaSearch from '@pages/SEOMeta/SEOMetaSearch';
import SEOMetaAgGrid from '@pages/SEOMeta/SEOMetaAgGrid';
import { useDispatch, useSelector } from 'react-redux';
import { getSeoMetaList } from '@store/seoMeta';

const SEOMetaList = () => {
    const dispatch = useDispatch();
    const { list, search, total, totalId } = useSelector((store) => ({
        list: store.seoMeta.list,
        search: store.seoMeta.search,
        total: store.seoMeta.total,
        totalId: store.seoMeta.totalId,
    }));

    useEffect(() => {
        dispatch(getSeoMetaList(search));
    }, [dispatch, search]);

    return (
        <>
            <SEOMetaSearch searchOptions={search} />
            <SEOMetaAgGrid rows={list} searchOptions={search} total={total} />
        </>
    );
};

export default SEOMetaList;
