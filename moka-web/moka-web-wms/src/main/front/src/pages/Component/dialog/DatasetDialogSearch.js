import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextFieldIcon, WmsSelect } from '~/components';
import { changeSearchOption, clearDataset, getDatasetList } from '~/stores/dataset/datasetStore';
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
    const { detail, search, domains, latestDomainId } = useSelector((state) => ({
        detail: state.componentStore.detail,
        search: state.datasetStore.search,
        domains: state.authStore.domains,
        latestDomainId: state.authStore.latestDomainId
    }));
    const [initialCnt, setInitialCnt] = useState(0);

    /**
     * 검색 조건 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeSearchType = (e) => {
        const option = {
            ...search,
            searchType: e.target.value
        };
        dispatch(changeSearchOption(option));
    };

    /**
     * 키워드 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeKeyword = (e) => {
        const option = {
            ...search,
            keyword: e.target.value
        };
        dispatch(changeSearchOption(option));
    };

    /**
     * 검색
     * @param {object} e click이벤트
     */
    const onSearch = (e) => {
        const option = {
            ...search,
            page: 0
        };
        dispatch(getDatasetList(option));
    };

    useEffect(() => {
        if (initialCnt === 0) {
            dispatch(clearDataset());
            setInitialCnt(initialCnt + 1);
        } else if (initialCnt === 1) {
            const domain = domains.find((d) => d.domainId === latestDomainId);
            if (domain) {
                let option = {
                    ...search,
                    apiCodeId: domain.apiCodeId,
                    apiHost: domain.apiHost,
                    apiPath: domain.apiPath
                };
                if (detail.previousEditDataset && detail.previousEditDataset.datasetSeq) {
                    option.exclude = [detail.previousEditDataset.datasetSeq];
                }
                dispatch(getDatasetList(option));
            }
            setInitialCnt(initialCnt + 1);
        }
    }, [dispatch, detail, initialCnt, domains, latestDomainId, search]);

    // 언마운트시 클리어
    useEffect(() => {
        return () => {
            dispatch(clearDataset());
        };
    }, [dispatch]);

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
                onChange={onChangeSearchType}
            />
            <WmsTextFieldIcon
                placeholder="검색어를 입력하세요."
                width="calc(100% - 178px)"
                icon="search"
                name="keyword"
                value={search.keyword}
                onChange={onChangeKeyword}
                onIconClick={onSearch}
                onEnter={onSearch}
            />
        </div>
    );
};

export default DatasetDialogSearch;
