import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { WmsSelect, WmsTextFieldIcon, WmsTable } from '~/components';
import style, {
    searchTypeWidth,
    searchTypeLabelWidth,
    keywordWidth
} from '~/assets/jss/pages/RelationStyle';
import {
    PageDialog,
    pageSearchTypes as searchTypes,
    pageSearchColumns as searchColumns
} from '../components';
import {
    clearRelationPage as clear,
    getRelationPageList as getList,
    initialState
} from '~/stores/page/pageRelationPGStore';

const useStyles = makeStyles(style);

const PageRelationPG = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const latestPageSeq = useSelector((store) => store.pageStore.latestPageSeq);
    const { orgSearch, list, total, error, loading } = useSelector(
        ({ pageRelationPGStore, loadingStore }) => ({
            orgSearch: pageRelationPGStore.search,
            list: pageRelationPGStore.list,
            total: pageRelationPGStore.total,
            error: pageRelationPGStore.error,
            loading: loadingStore['pageRelationPGStore/GET_RELATION_PAGE_LIST']
        })
    );
    const [listRows, setListRows] = useState([]);
    const [search, setSearch] = useState(initialState.search);
    const [selected, setSelected] = useState({ open: false, pageSeq: null, title: null });

    useEffect(() => {
        return () => {
            dispatch(clear());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 검색
    useEffect(() => {
        if (latestDomainId && latestPageSeq) {
            const option = {
                ...initialState.search,
                domainId: latestDomainId,
                searchType: 'pageSeq',
                keyword: String(latestPageSeq)
            };
            dispatch(getList(option));
        }
    }, [dispatch, latestPageSeq, latestDomainId]);

    // 검색조건 로컬화
    useEffect(() => {
        const option = {
            ...orgSearch,
            domainId: latestDomainId
        };
        setSearch(option);
    }, [orgSearch, latestDomainId]);

    // 목록 로컬화
    useEffect(() => {
        if (list) {
            setListRows(
                list.map((t) => ({
                    id: String(t.pageSeq),
                    pageSeq: t.pageSeq,
                    pageName: t.pageName,
                    pageUrlLink: `//${t.domain.domainUrl}${t.pageUrl === '/' ? '' : t.pageUrl}`
                }))
            );
        }
    }, [list]);

    // 검색조건 변경
    const handleChangeSearchOption = useCallback(
        (e) => {
            setSearch({
                ...search,
                [e.target.name]: e.target.value
            });
        },
        [search]
    );

    // 테이블에서 검색옵션 변경하는 경우(즉시조회)
    const handleTableSearchOption = useCallback(
        (payload) => {
            const option = {
                ...search,
                [payload.key]: payload.value
            };
            dispatch(getList(option));
        },
        [dispatch, search]
    );

    // 검색버튼 클릭(즉시조회)
    const onSearch = useCallback(
        (e) => {
            e.preventDefault();
            const option = {
                ...search,
                page: 0
            };
            dispatch(getList(option));
        },
        [dispatch, search]
    );

    // 테이블에서 Row클릭. 페이지템플릿팝업
    const handleRowClick = useCallback((e, row) => {
        setSelected({ open: true, pageSeq: row.pageSeq, title: row.pageName });
    }, []);

    // 페이지템플릿 팝업 종료
    const handleTemplateClose = useCallback(() => {
        setSelected({ open: false, pageSeq: null, title: null });
    }, []);

    return (
        <>
            <div className={classes.mb8}>
                <WmsSelect
                    label="구분"
                    labelWidth={searchTypeLabelWidth}
                    width={searchTypeWidth}
                    overrideClassName={classes.mr8}
                    name="searchType"
                    rows={searchTypes}
                    currentId={search.searchType}
                    onChange={handleChangeSearchOption}
                />
                <WmsTextFieldIcon
                    placeholder="검색어를 입력하세요"
                    width={keywordWidth}
                    icon="search"
                    name="keyword"
                    value={search.keyword}
                    onChange={handleChangeSearchOption}
                    onIconClick={onSearch}
                    onEnter={onSearch}
                />
            </div>
            <div className={classes.pagePageTable}>
                <WmsTable
                    columns={searchColumns}
                    rows={listRows}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onRowClick={handleRowClick}
                    onChangeSearchOption={handleTableSearchOption}
                    // currentId={currentSeq}
                    loading={loading}
                    error={error}
                />
                {/** 페이지 수정 팝업 */}
                {selected.open && <PageDialog onClose={handleTemplateClose} selected={selected} />}
            </div>
        </>
    );
};

export default PageRelationPG;
