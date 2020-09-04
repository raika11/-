import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { getArticles, changeSearchOptions } from '~/stores/article/articleStore';
import { WmsButton, WmsPagination } from '~/components';
import ArticleListSearch from './ArticleListSearch';
import ArticleListAgGrid from './ArticleListAgGrid';

/**
 * 화면편집 > 기사리스트
 * @param {object} props.classes DeskingStyle
 */
const ArticleList = (props) => {
    const { classes } = props;
    const dispatch = useDispatch();
    const updateGridCount = useSelector((store) => store.gridStore.total);
    const { loading, search, total, list, latestMediaId, component, deskingList } = useSelector(
        (store) => ({
            loading:
                store.loadingStore['articleStore/GET_ARTICLES'] ||
                store.loadingStore['deskingStore/GET_COMPONENT_WORK_LIST'],
            search: store.articleStore.search,
            total: store.articleStore.total,
            list: store.articleStore.list,
            latestMediaId: store.authStore.latestMediaId,
            component: store.deskingStore.component,
            deskingList: store.deskingStore.list
        })
    );

    const onChangeSearchOption = (payload) => {
        if (payload.key !== 'page') {
            dispatch(getArticles(changeSearchOptions([{ key: 'page', value: 0 }, payload])));
        } else {
            dispatch(getArticles(changeSearchOptions([payload])));
        }
    };

    useEffect(() => {
        if (component == null) {
            dispatch(
                getArticles(
                    changeSearchOptions([
                        { key: 'mediaId', value: latestMediaId },
                        { key: 'page', value: 0 },
                        { key: 'codeId', value: '' },
                        { key: 'lang', value: '' },
                        { key: 'serviceType', value: '' }
                    ])
                )
            );
        } else {
            dispatch(
                getArticles(
                    changeSearchOptions([
                        { key: 'mediaId', value: latestMediaId },
                        { key: 'page', value: 0 },
                        { key: 'codeId', value: component.searchCodeId },
                        { key: 'lang', value: component.searchLang },
                        { key: 'serviceType', value: component.searchServiceType }
                    ])
                )
            );
        }
    }, [dispatch, latestMediaId, component]);

    return (
        <div className={classes.articleListRoot}>
            {/* 탑 영역(검색 + info) */}
            <div className={classes.articleListTop}>
                <ArticleListSearch classes={classes} />
                <div className={classes.articleListInfo}>
                    <WmsButton color="wolf">고침기사 보기</WmsButton>
                    <div className={classes.inLine}>
                        <Typography
                            component="div"
                            variant="subtitle1"
                            className={clsx(classes.inLine, classes.mr20)}
                        >
                            <div className={clsx(classes.circle1, classes.mr8)}></div>
                            서비스노출
                        </Typography>
                        <Typography component="div" variant="subtitle1" className={classes.inLine}>
                            <div className={clsx(classes.circle2, classes.mr8)}></div>
                            고침기사
                        </Typography>
                    </div>
                </div>
            </div>

            {/* 테이블 영역 */}
            <div className={clsx(classes.articleListAgGrid, 'ag-theme-wms-grid')}>
                <ArticleListAgGrid
                    classes={classes}
                    data={list}
                    loading={loading}
                    deskingList={deskingList}
                    updateGridCount={updateGridCount}
                />
            </div>

            {/* 페이징 */}
            <WmsPagination
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={onChangeSearchOption}
            />
        </div>
    );
};

export default ArticleList;
