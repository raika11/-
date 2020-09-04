import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTable, WmsButton } from '~/components';
import {
    getDomains,
    getDomain,
    changeSearchOption,
    clearDomain
} from '~/stores/domain/domainStore';
import styles from '~/assets/jss/pages/Domain/DomainStyle';
import tableColumns from './components/tableColumns';

const useStyles = makeStyles(styles);

/**
 * 도메인 리스트 > 테이블
 */
const DomainTableContainer = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { detail, list, total, search, error, loading, latestMediaId } = useSelector((store) => ({
        detail: store.domainStore.detail,
        list: store.domainStore.list,
        total: store.domainStore.total,
        search: store.domainStore.search,
        error: store.domainStore.error,
        loading: store.loadingStore['domainStore/GET_DOMAINS'],
        latestMediaId: store.authStore.latestMediaId
    }));
    const [domainRows, setDomainRows] = useState([]);

    /**
     * 목록에서 아이템 클릭 (상세 조회)
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleRowClick = (e, row) => history.push(row.link);

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((payload) => dispatch(getDomains(payload)), [
        dispatch
    ]);

    /**
     * 도메인 추가 버튼
     */
    const onAddClick = () => history.push('/domain');

    useEffect(() => {
        dispatch(
            getDomains(
                changeSearchOption({
                    key: 'mediaId',
                    value: latestMediaId
                })
            )
        );
    }, [latestMediaId, dispatch]);

    useEffect(() => {
        if (list.length > 0) {
            setDomainRows(
                list.map((d) => ({
                    id: String(d.domainId),
                    domainId: d.domainId,
                    domainName: d.domainName,
                    domainUrl: d.domainUrl,
                    link: `/domain/${d.domainId}`
                }))
            );
        }
    }, [list]);

    return (
        <>
            <div className={clsx(classes.listTableButtonGroup, classes.mb8)}>
                <WmsButton color="wolf" overrideClassName={classes.m0} onClick={onAddClick}>
                    <span>도메인 추가</span>
                </WmsButton>
            </div>
            <div className={classes.listTable}>
                <WmsTable
                    columns={tableColumns}
                    rows={domainRows}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onRowClick={handleRowClick}
                    onChangeSearchOption={handleChangeSearchOption}
                    currentId={String(detail.domainId)}
                    loading={loading}
                    error={error}
                />
            </div>
        </>
    );
};

export default DomainTableContainer;
