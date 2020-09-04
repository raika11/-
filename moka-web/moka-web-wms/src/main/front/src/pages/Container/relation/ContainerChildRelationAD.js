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
import { TemplateDialog } from '~/pages/Page/components';
import { adSearchTypes as searchTypes, adSearchColumns as searchColumns } from '../components';
import {
    clearAd as clear,
    getAds as getList,
    changeSearchOptions,
    initialState
} from '~/stores/ad/adStore';

const useStyles = makeStyles(style);

const ContainerChildRelationAD = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const latestContainerSeq = useSelector((store) => store.containerStore.latestContainerSeq);
    const { orgSearch, list, total, error, loading } = useSelector(({ adStore, loadingStore }) => ({
        orgSearch: adStore.search,
        list: adStore.list,
        total: adStore.total,
        error: adStore.error,
        loading: loadingStore['adStore/GET_ADS']
    }));
    const [listRows, setListRows] = useState([]);
    const [search, setSearch] = useState(initialState.search);
    const [selected, setSelected] = useState({ open: false, templateSeq: null, title: null });

    useEffect(() => {
        return () => {
            dispatch(clear());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (latestDomainId && latestContainerSeq) {
            const option = [
                { key: 'domainId', value: latestDomainId },
                { key: 'searchType', value: 'containerSeq' },
                { key: 'keyword', value: String(latestContainerSeq) },
                { key: 'sort', value: 'relOrder,asc' }
            ];
            dispatch(getList(changeSearchOptions(option)));
        }
    }, [dispatch, latestContainerSeq, latestDomainId]);

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
                list.map((c) => ({
                    id: String(c.adSeq),
                    adSeq: c.adSeq,
                    adName: c.adName,
                    tpZone: c.tpZone
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

            let changeSearch = [];
            Object.keys(search).forEach((m) => {
                if (m === 'page') {
                    changeSearch.push({ key: 'page', value: 0 });
                } else if (m === 'sort') {
                    const sortValue =
                        search.searchType === 'containerSeq' ? 'relOrder,asc' : 'adSeq,desc';
                    changeSearch.push({ key: 'sort', value: sortValue });
                } else {
                    if (search[m] !== orgSearch[m]) {
                        changeSearch.push({ key: m, value: search[m] });
                    }
                }
            });

            dispatch(getList(changeSearchOptions(changeSearch)));
        },
        [dispatch, search, orgSearch]
    );

    // 광고추가 클릭
    const onAddClick = useCallback(() => {
        history.push('/ad');
    }, [history]);

    // 테이블에서 Row클릭. 템플릿팝업
    const handleRowClick = useCallback((e, row) => {
        setSelected({ open: true, adSeq: row.adSeq, title: row.adName });
    }, []);

    // 템플릿 팝업 종료
    const handleTemplateClose = useCallback(() => {
        setSelected({ open: false, templateSeq: null, title: null });
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
                    <span>광고 추가</span>
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
                {/** 템플릿 수정 팝업 */}
                {selected.open && (
                    <TemplateDialog onClose={handleTemplateClose} selected={selected} />
                )}
            </div>
        </>
    );
};

export default ContainerChildRelationAD;
