import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { WmsButton, WmsTable } from '~/components';
import style from '~/assets/jss/pages/RelationStyle';
import { skinSearchColumns as searchColumns } from '../components';
import { SKIN_CONTENTS_ID } from '~/constants';
import {
    clearRelationSkin as clear,
    getRelationSkinList as getList,
    initialState
} from '~/stores/container/containerRelationCSStore';

const useStyles = makeStyles(style);

const ContainerRelationCS = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const latestContainerSeq = useSelector((store) => store.containerStore.latestContainerSeq);
    const { orgSearch, list, total, error, loading  } = useSelector(
        ({ containerRelationCSStore, loadingStore }) => ({
            orgSearch: containerRelationCSStore.search,
            list: containerRelationCSStore.list,
            total: containerRelationCSStore.total,
            error: containerRelationCSStore.error,
            loading: loadingStore['containerRelationCSStore/GET_RELATION_SKIN_LIST']
        })
    );
    const [listRows, setListRows] = useState([]);
    const [search, setSearch] = useState(initialState.search);

    useEffect(() => {
        return () => {
            dispatch(clear());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 검색
    useEffect(() => {
        if (latestDomainId && latestContainerSeq) {
            const option = {
                ...initialState.search,
                domainId: latestDomainId,
                relSeq: latestContainerSeq
            };
            dispatch(getList(option));
        }
    }, [dispatch, latestContainerSeq, latestDomainId]);

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

    // 추가 클릭
    const onAddClick = () => {
        history.push('/skin');
    };

    return (
        <>
            <div className={clsx(classes.button, classes.mb8)}>
                <WmsButton color="wolf" onClick={onAddClick}>
                    <span>콘텐츠스킨 추가</span>
                </WmsButton>
            </div>
            <div className={classes.table}>
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

export default ContainerRelationCS;
