import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { WmsSelect, WmsTextFieldIcon } from '~/components';
import style from '~/assets/jss/pages/RelationStyle';
import { templateSearchTypes as searchTypes } from '../components';
import {
    clearTemplate as clear,
    getTemplates as getList,
    changeSearchOptions,
    initialState
} from '~/stores/template/templateStore';
import { getTPZone, getTPSize } from '~/stores/etccodeType/etccodeTypeStore';

const useStyles = makeStyles(style);
const defaultDomain = { id: 'all', name: '공통 도메인' };
const defaultTPZone = { id: 'all', name: '위치그룹 전체' };
const defaultTPSize = { id: 'all', name: '사이즈 전체' };

const ContainerChildRelationSearchTP = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const latestContainerSeq = useSelector((store) => store.containerStore.latestContainerSeq);
    const { latestDomainId, domains } = useSelector(({ authStore }) => ({
        latestDomainId: authStore.latestDomainId,
        domains: authStore.domains
    }));
    const { orgSearch, tpZoneRows, tpSizeRows } = useSelector((store) => ({
        orgSearch: store.templateStore.search,
        tpZoneRows: store.etccodeTypeStore.tpZoneRows,
        tpSizeRows: store.etccodeTypeStore.tpSizeRows
    }));
    const [domainRows, setDomainRows] = useState([]);
    const [loadCnt, setLoadCnt] = useState(0);
    const [sizeRows, setSizeRows] = useState([]);
    const [zoneRows, setZoneRows] = useState([]);
    const [search, setSearch] = useState(initialState.search);

    useEffect(() => {
        return () => {
            dispatch(clear());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 위치그룹, 사이즈 코드 조회
    useEffect(() => {
        if (loadCnt < 1) {
            dispatch(getTPSize());
            dispatch(getTPZone());
            setLoadCnt(loadCnt + 1);
        } else {
            setSizeRows([].concat(defaultTPSize, tpSizeRows));
            setZoneRows([].concat(defaultTPZone, tpZoneRows));
        }
    }, [dispatch, loadCnt, tpSizeRows, tpZoneRows]);

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

    // 도메인목록 로컬화. 공통도메인 + 페이지도메인
    useEffect(() => {
        if (domains) {
            const rows1 = domains.filter((m) => latestDomainId === m.domainId);
            const rows2 = rows1.map((m) => ({
                id: m.domainId,
                name: m.domainName
            }));
            rows2.unshift(defaultDomain);
            setDomainRows(rows2);
        }
    }, [domains, latestDomainId]);

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
                        search.searchType === 'containerSeq' ? 'relOrder,asc' : 'templateSeq,desc';
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

    return (
        <div className={clsx(classes.root, classes.mb8)}>
            <WmsSelect
                fullWidth
                overrideClassName={classes.mb8}
                name="domainId"
                rows={domainRows}
                currentId={search.domainId}
                onChange={onSearch}
            />
            <WmsSelect
                width={227}
                overrideClassName={clsx(classes.mb8, classes.mr8)}
                name="tpZone"
                rows={zoneRows}
                currentId={search.tpZone}
                onChange={handleChangeSearchOption}
            />
            <WmsSelect
                width="calc(100% - 235px)"
                overrideClassName={classes.mb8}
                name="tpSize"
                rows={sizeRows}
                currentId={search.tpSize}
                onChange={handleChangeSearchOption}
            />
            <WmsSelect
                width={166}
                overrideClassName={classes.mr8}
                name="searchType"
                rows={searchTypes}
                currentId={search.searchType}
                onChange={handleChangeSearchOption}
            />
            <WmsTextFieldIcon
                placeholder="검색어를 입력하세요."
                width="calc(100% - 174px)"
                icon="search"
                name="keyword"
                value={search.keyword}
                onChange={handleChangeSearchOption}
                onIconClick={onSearch}
                onEnter={onSearch}
            />
        </div>
    );
};

export default ContainerChildRelationSearchTP;
