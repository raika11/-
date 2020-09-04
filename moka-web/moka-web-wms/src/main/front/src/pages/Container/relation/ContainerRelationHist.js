import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { WmsSelect, WmsTextFieldIcon, WmsTable } from '~/components';
import { defaultFormat } from '~/utils/dateUtil';
import style, {
    searchTypeWidth,
    searchTypeLabelWidth,
    keywordWidth
} from '~/assets/jss/pages/RelationStyle';
import {
    historySearchTypes as searchTypes,
    historyColumns as searchColumns
} from '../components/relationColumns';
import {
    clearHistory as clear,
    getHistoryList as getList,
    initialState
} from '~/stores/container/containerHistoryStore';

const useStyles = makeStyles(style);

const ContainerRelationHist = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const latestContainerSeq = useSelector((store) => store.containerStore.latestContainerSeq);
    const { orgSearch, list, total, error, loading } = useSelector(
        ({ containerHistoryStore, loadingStore }) => ({
            orgSearch: containerHistoryStore.search,
            list: containerHistoryStore.list,
            total: containerHistoryStore.total,
            error: containerHistoryStore.error,
            loading: loadingStore['containerHistoryStore/GET_HISTORY_LIST']
        })
    );
    const [listRows, setListRows] = useState([]);
    const [search, setSearch] = useState(initialState.search);

    // 초기화
    useEffect(() => {
        return () => {
            dispatch(clear());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (latestContainerSeq) {
            const option = {
                ...initialState.search,
                seq: latestContainerSeq
            };
            dispatch(getList(option));
        }
    }, [latestContainerSeq, dispatch]);

    // 검색조건 로컬화
    useEffect(() => {
        setSearch(orgSearch);
    }, [orgSearch]);

    // 목록 로컬화
    useEffect(() => {
        if (list) {
            setListRows(
                list.map((t) => ({
                    id: String(t.seq),
                    seq: t.seq,
                    createYmdt: defaultFormat(t.createYmdt),
                    creator: t.creator
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
            if (!latestContainerSeq) return;

            const option = {
                ...search,
                [payload.key]: payload.value
            };
            dispatch(getList(option));
        },
        [dispatch, search, latestContainerSeq]
    );

    // 검색버튼 클릭(즉시조회)
    const onSearch = useCallback(
        (e) => {
            e.preventDefault();
            if (!latestContainerSeq) return;

            const option = {
                ...search,
                page: 0
            };
            dispatch(getList(option));
        },
        [dispatch, search, latestContainerSeq]
    );

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
                    placeholder="날짜(20201210) 또는 검색어 입력하세요"
                    width={keywordWidth}
                    icon="search"
                    name="keyword"
                    value={search.keyword}
                    onChange={handleChangeSearchOption}
                    onIconClick={onSearch}
                    onEnter={onSearch}
                />
            </div>
            <div className={classes.histTable}>
                <WmsTable
                    columns={searchColumns}
                    rows={listRows}
                    total={total}
                    page={search.page}
                    size={search.size}
                    // onRowClick={handleRowClick}
                    onChangeSearchOption={handleTableSearchOption}
                    // currentId={currentSeq}
                    loading={loading}
                    error={error}
                />
            </div>
        </>
    );
};

export default ContainerRelationHist;
