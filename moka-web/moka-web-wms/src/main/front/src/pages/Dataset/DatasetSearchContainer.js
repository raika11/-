import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import WmsSelect from '~/components/WmsSelects';
import { WmsTextFieldIcon } from '~/components/WmsTextFields';
import style from '~/assets/jss/pages/Dataset/DatasetStyle';
import { tableSearchTypes, autoCreateSearchTypes } from './components';
import { getApi } from '~/stores/etccodeType/etccodeTypeStore';
import {
    getDatasetList,
    changeSearchOption,
    initialState,
    clearDataset
} from '~/stores/dataset/datasetStore';

const useStyle = makeStyles(style);

const DatasetSearchContainer = ({ history }) => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const domains = useSelector((store) => store.authStore.domains);
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const apiRows = useSelector((store) => store.etccodeTypeStore.apiRows);
    const orgSearch = useSelector((store) => store.datasetStore.search);
    const [search, setSearch] = useState(initialState.search);

    // APICODE목록 조회
    useEffect(() => {
        if (!apiRows || apiRows.length <= 0) {
            dispatch(getApi());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 검색정보 로컬화
    useEffect(() => {
        if (orgSearch) {
            setSearch(orgSearch);
        }
        return () => {
            setSearch(initialState.search);
        };
    }, [orgSearch]);

    // search.apiCodeId 검색조건 세팅. 최초에 도메인정보에서 apiCodeId조회
    useEffect(() => {
        // apiCodes가 없으면 조회하지 않는다.
        if (!apiRows) return;

        if (!search.apiCodeId) {
            // 도메인정보가 없으면, apiCodes[0]
            if (latestDomainId === undefined && apiRows.length > 0) {
                const option = {
                    ...initialState.search,
                    apiCodeId: apiRows[0].codeId,
                    apiHost: apiRows[0].codeNameEtc1,
                    apiPath: apiRows[0].codeNameEtc2
                };
                dispatch(changeSearchOption(option));
            } else {
                // 도메인정보가 있으면, 도메인의 apiCodeId
                const domain = domains.filter((d) => d.domainId === latestDomainId);
                if (domain.length > 0) {
                    const option = {
                        ...initialState.search,
                        apiCodeId: domain[0].apiCodeId,
                        apiHost: domain[0].apiHost,
                        apiPath: domain[0].apiPath
                    };
                    dispatch(changeSearchOption(option));
                }
            }
        }
    }, [dispatch, apiRows, latestDomainId, history, search.apiCodeId, domains]);

    // API 검색조건 변경. 다른검색조건 초기화
    const handleChangeApiSearchOption = useCallback(
        (e) => {
            dispatch(clearDataset());

            const selectedApi = apiRows.filter((d) => d.codeId === e.target.value);
            if (selectedApi.length > 0) {
                const option = {
                    ...initialState.search,
                    apiCodeId: selectedApi[0].codeId,
                    apiHost: selectedApi[0].codeNameEtc1,
                    apiPath: selectedApi[0].codeNameEtc2
                };
                dispatch(changeSearchOption(option));
                history.push('/dataset');
            }
        },
        [dispatch, history, apiRows]
    );

    // apiCodeId 변경(즉시조회)
    useEffect(() => {
        if (search.apiCodeId) {
            dispatch(getDatasetList());
        }
    }, [dispatch, search.apiCodeId]);

    // 검색버튼 클릭(즉시조회)
    const onSearch = useCallback(
        (e) => {
            e.preventDefault();

            const option = {
                ...search,
                page: 0
            };
            dispatch(getDatasetList(option));
            history.push('/dataset');
        },
        [dispatch, search, history]
    );

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

    return (
        <div className={clsx(classes.listSearchRoot, classes.mb8)}>
            <>
                <WmsSelect
                    rows={apiRows}
                    currentId={search.apiCodeId}
                    width={227}
                    overrideClassName={clsx(classes.mb8, classes.mr8)}
                    name="apiCodeId"
                    onChange={handleChangeApiSearchOption}
                />
                <WmsSelect
                    rows={autoCreateSearchTypes}
                    currentId={search.autoCreateYn}
                    width="calc(100% - 235px)"
                    overrideClassName={classes.mb8}
                    name="autoCreateYn"
                    onChange={handleChangeSearchOption}
                />
            </>
            <>
                <WmsSelect
                    rows={tableSearchTypes}
                    currentId={search.searchType}
                    width={166}
                    overrideClassName={classes.mr8}
                    name="searchType"
                    onChange={handleChangeSearchOption}
                />
                <WmsTextFieldIcon
                    placeholder="검색어를 입력하세요."
                    value={search.keyword}
                    width="calc(100% - 174px)"
                    icon="search"
                    name="keyword"
                    onChange={handleChangeSearchOption}
                    onIconClick={onSearch}
                    onEnter={onSearch}
                />
            </>
        </div>
    );
};

export default withRouter(DatasetSearchContainer);
