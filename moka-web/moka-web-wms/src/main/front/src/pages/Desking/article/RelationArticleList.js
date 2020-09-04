import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsPagination } from '~/components';
import RelationArticleListSearch from './RelationArticleListSearch';
import RelationArticleListAgGrid from './RelationArticleListAgGrid';
import { getArticles, changeSearchOption, clearAll } from '~/stores/article/relationArticleStore';
import style from '~/assets/jss/pages/Desking/DeskingStyle';

const useStyle = makeStyles(style);

/**
 * 관련기사 리스트
 */
const RelationArticleList = (props) => {
    const { component, contentsId, deskingWork, deskingRelWorks } = props;
    const classes = useStyle();
    const dispatch = useDispatch();
    const { loading, search, total, list, latestMediaId } = useSelector((store) => ({
        loading: store.loadingStore['relationArticleStore/GET_ARTICLES'],
        search: store.relationArticleStore.search,
        total: store.relationArticleStore.total,
        list: store.relationArticleStore.list,
        latestMediaId: store.authStore.latestMediaId
    }));

    const onChangeSearchOption = (payload) => {
        if (payload.key !== 'page') {
            dispatch(
                getArticles(
                    changeSearchOption({ key: 'page', value: 0 }),
                    changeSearchOption(payload)
                )
            );
        } else {
            dispatch(getArticles(changeSearchOption(payload)));
        }
    };

    useEffect(() => {
        dispatch(
            getArticles(
                changeSearchOption({ key: 'mediaId', value: latestMediaId }),
                changeSearchOption({ key: 'page', value: 0 }),
                changeSearchOption({ key: 'searchCodeId', value: component.searchCodeId || '' })
            )
        );
    }, [dispatch, latestMediaId, component]);

    useEffect(() => {
        return () => {
            dispatch(clearAll());
        };
    }, [dispatch]);

    return (
        <>
            {/* 검색 */}
            <RelationArticleListSearch classes={classes} />

            {/* 테이블 */}
            <div className={clsx(classes.relArticleListAgGrid, 'ag-theme-wms-grid')}>
                <RelationArticleListAgGrid
                    classes={classes}
                    data={list}
                    contentsId={contentsId}
                    loading={loading}
                    deskingWork={deskingWork}
                    deskingRelWorks={deskingRelWorks}
                />
            </div>

            {/* 페이징 */}
            <WmsPagination
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={onChangeSearchOption}
            />
        </>
    );
};

export default RelationArticleList;
