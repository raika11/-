import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { WmsButton, WmsSelect, WmsTextFieldIcon, WmsTable } from '~/components';
import style, {
    searchTypeWidth,
    searchTypeLabelWidth,
    keywordWidth
} from '~/assets/jss/pages/RelationStyle';
import {
    ContainerDialog,
    containerSearchTypes as searchTypes,
    containerSearchColumns as searchColumns
} from '../components';
import {
    clearContainer as clear,
    getContainerList as getList,
    initialState
} from '~/stores/container/containerStore';

const useStyles = makeStyles(style);

const PageChildRelationCT = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const latestPageSeq = useSelector((store) => store.pageStore.latestPageSeq);
    const { orgSearch, list, total, error, loading } = useSelector(
        ({ containerStore, loadingStore }) => ({
            orgSearch: containerStore.search,
            list: containerStore.list,
            total: containerStore.total,
            error: containerStore.error,
            loading: loadingStore['containerStore/GET_CONTAINER_LIST']
        })
    );
    const [listRows, setListRows] = useState([]);
    const [search, setSearch] = useState(initialState.search);
    const [selected, setSelected] = useState({ open: false, containerSeq: null, title: null });

    useEffect(() => {
        return () => {
            dispatch(clear());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (latestDomainId && latestPageSeq) {
            const option = {
                ...initialState.search,
                domainId: latestDomainId,
                pageSeq: latestPageSeq,
                searchType: 'pageSeq',
                keyword: String(latestPageSeq)
                // sort: 'containerSeq,desc'
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
                    id: String(t.containerSeq),
                    containerSeq: t.containerSeq,
                    containerName: t.containerName
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

    // 컨테이너추가 클릭
    const onAddClick = useCallback(() => {
        history.push('/container');
    }, [history]);

    // 테이블에서 Row클릭. 컨테이너팝업
    const handleRowClick = useCallback((e, row) => {
        setSelected({ open: true, containerSeq: row.containerSeq, title: row.containerName });
    }, []);

    // 컨테이너팝업 종료
    const handleContainerClose = useCallback(() => {
        setSelected({ open: false, containerSeq: null, title: null });
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
            <div className={clsx(classes.button, classes.mb8)}>
                <WmsButton color="wolf" overrideClassName={classes.m0} onClick={onAddClick}>
                    <span>컨테이너 추가</span>
                </WmsButton>
            </div>
            <div className={classes.childTable}>
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
                {/** 컨테이너 수정 팝업 */}
                {selected.open && (
                    <ContainerDialog onClose={handleContainerClose} selected={selected} />
                )}
            </div>
        </>
    );
};

export default PageChildRelationCT;
