import React, { useEffect } from 'react';
import SEOMetaSearch from '@pages/SEOMeta/SEOMetaSearch';
import SEOMetaAgGrid from '@pages/SEOMeta/SEOMetaAgGrid';
import { useDispatch, useSelector } from 'react-redux';
import { getSeoMetaList } from '@store/seoMeta';

const SEOMetaList = () => {
    const dispatch = useDispatch();
    const { search } = useSelector((store) => ({
        search: store.seoMeta.search,
    }));

    useEffect(() => {
        dispatch(getSeoMetaList(search));
    }, [dispatch, search]);

    return (
        <>
            <SEOMetaSearch searchOptions={search} />
            <SEOMetaAgGrid />
        </>
    );
};

export default SEOMetaList;
