import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { WmsButton, WmsSelect, WmsTable } from '~/components';
import style from '~/assets/jss/pages/RelationStyle';
import { skinSearchColumns as searchColumns } from '../components';
import { SKIN_CONTENTS_ID } from '~/constants';
import {
    clearRelationSkin as clear,
    getRelationSkinList as getList,
    initialState
} from '~/stores/dataset/datasetRelationCSStore';

const useStyles = makeStyles(style);
const defaultDomain = { id: 'all', name: '전체' };

const DatasetRelationCS = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const domains = useSelector((store) => store.authStore.domains);
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const latestDatasetSeq = useSelector((store) => store.datasetStore.latestDatasetSeq);
    const { orgSearch, list, total, error, loading } = useSelector(
        ({ datasetRelationCSStore, loadingStore }) => ({
            orgSearch: datasetRelationCSStore.search,
            list: datasetRelationCSStore.list,
            total: datasetRelationCSStore.total,
            error: datasetRelationCSStore.error,
            loading: loadingStore['datasetRelationCSStore/GET_RELATION_SKIN_LIST']
        })
    );
    const [listRows, setListRows] = useState([]);
    const [search, setSearch] = useState(initialState.search);
    const [domainRows, setDomainRows] = useState([]);

    useEffect(() => {
        return () => {
            dispatch(clear());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 검색
    useEffect(() => {
        if (latestDomainId && latestDatasetSeq) {
            const option = {
                ...initialState.search,
                domainId: latestDomainId,
                relSeq: latestDatasetSeq
            };
            dispatch(getList(option));
        }
    }, [dispatch, latestDatasetSeq, latestDomainId]);

    // 검색조건 로컬화
    useEffect(() => {
        setSearch(orgSearch);
    }, [orgSearch]);

    // 목록 로컬화
    useEffect(() => {
        if (list) {
            setListRows(
                list.map((t) => {
                    let url = `//${t.domain.domainUrl}/view/${SKIN_CONTENTS_ID}`;
                    url = `${url}?section=${t.skinServiceName}`;
                    return {
                        id: String(t.skinSeq),
                        domainName: t.domain.domainName,
                        servicePlatform: t.domain.servicePlatform,
                        skinSeq: t.skinSeq,
                        skinName: t.skinName,
                        styleName: t.style && t.style.styleName,
                        previewUrl: `${url}`
                    };
                })
            );
        }
    }, [list]);

    // 도메인 로컬화
    useEffect(() => {
        if (domains) {
            const rows1 = domains.map((m) => {
                return {
                    id: m.domainId,
                    name: m.domainName
                };
            });
            rows1.unshift(defaultDomain);
            setDomainRows(rows1);
        }
    }, [domains]);

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

    // 도메인에서 검색옵션 변경하는 경우(즉시조회)
    const handleChangeDomainSearchOption = useCallback(
        (e) => {
            const option = {
                ...search,
                page: 0,
                domainId: e.target.value
            };
            dispatch(getList(option));
        },
        [dispatch, search]
    );

    // 추가 클릭
    const onAddClick = () => {
        history.push('/skin');
    };

    return (
        <>
            <div className={classes.mb8}>
                <WmsSelect
                    rows={domainRows}
                    fullWidth
                    name="domainId"
                    onChange={handleChangeDomainSearchOption}
                    currentId={search.domainId}
                />
            </div>
            <div className={clsx(classes.button, classes.mb8)}>
                <WmsButton color="wolf" onClick={onAddClick}>
                    <span>콘텐츠스킨 추가</span>
                </WmsButton>
            </div>
            <div className={classes.pageTable}>
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

export default DatasetRelationCS;
