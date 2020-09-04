import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextFieldIcon, WmsSelect } from '~/components';
import {
    changeSearchOption,
    getDatasetList,
    defaultPopSearch
} from '~/stores/dataset/datasetAutoStore';
import style from '~/assets/jss/pages/DialogStyle';

const useStyle = makeStyles(style);

const defaultSearchType = [
    { id: 'all', name: '전체' },
    { id: 'datasetSeq', name: '데이터셋ID' },
    { id: 'datasetName', name: '데이터셋명' }
];

const DatasetDialogSearch = () => {
    const dispatch = useDispatch();
    const classes = useStyle();
    const datasetSearch = useSelector((store) => store.datasetStore.search);
    const search = useSelector((store) => store.datasetAutoStore.search);
    const { domains, latestDomainId } = useSelector((store) => ({
        domains: store.authStore.domains,
        latestDomainId: store.authStore.latestDomainId
    }));

    // 초기 검색
    useEffect(() => {
        let goSearch = false;

        let option = { ...defaultPopSearch };

        if (search.listType !== option.listType) {
            goSearch = true;
        }

        if (!search.apiCodeId) {
            // apiCodeId우선순위: datasetStore.apiCodeId > latestDomainId
            if (datasetSearch.apiCodeId) {
                option = {
                    ...option,
                    apiCodeId: datasetSearch.apiCodeId,
                    apiHost: datasetSearch.apiHost,
                    apiPath: datasetSearch.apiPath
                };
                goSearch = true;
            } else if (latestDomainId && domains) {
                const domain = domains.filter((d) => d.domainId === latestDomainId);
                if (domain && domain.apiCodeId) {
                    option = {
                        ...option,
                        apiCodeId: domain.apiCodeId,
                        apiHost: domain.apiHost,
                        apiPath: domain.apiPath
                    };
                    goSearch = true;
                }
            }
        }

        if (goSearch) dispatch(getDatasetList(option));
    }, [dispatch, datasetSearch, domains, latestDomainId, search]);

    // 언마운트시 검색조건 클리어
    useEffect(() => {
        return () => {
            dispatch(changeSearchOption(defaultPopSearch));
        };
    }, [dispatch]);

    // 검색 조건 변경 함수
    const onChangeSearchOption = useCallback(
        (e) => {
            const option = {
                ...search,
                [e.target.name]: e.target.value
            };
            dispatch(changeSearchOption(option));
        },
        [dispatch, search]
    );

    // 검색
    const onSearch = useCallback(
        (e) => {
            const option = {
                ...search,
                page: 0
            };
            dispatch(getDatasetList(option));
        },
        [dispatch, search]
    );

    return (
        <div className={classes.mb8}>
            <WmsSelect
                rows={defaultSearchType}
                label="구분"
                labelWidth="40"
                width="170"
                overrideClassName={classes.mr8}
                name="searchType"
                currentId={search.searchType}
                onChange={onChangeSearchOption}
            />
            <WmsTextFieldIcon
                placeholder="검색어를 입력하세요."
                width="calc(100% - 178px)"
                icon="search"
                name="keyword"
                value={search.keyword}
                onChange={onChangeSearchOption}
                onIconClick={onSearch}
                onEnter={onSearch}
            />
        </div>
    );
};

export default DatasetDialogSearch;
