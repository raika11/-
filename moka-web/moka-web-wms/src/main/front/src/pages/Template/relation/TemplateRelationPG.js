import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { WmsSelect, WmsButton, WmsTable } from '~/components';
import {
    changeSearchOption,
    changeSearchOptions,
    getRelations
} from '~/stores/template/templateRelationPGStore';
import style from '~/assets/jss/pages/RelationStyle';
import { pageColumns } from '../components/tableColumns';

const useStyles = makeStyles(style);
const defaultDomain = { id: 'all', name: '전체' };

/**
 * 템플릿 관련 페이지
 */
const TemplateRelationPG = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    let { templateSeq: currentSeq } = useParams();
    const {
        latestDomainId,
        domains,
        detail,
        search,
        relations,
        total,
        loading,
        error
    } = useSelector((store) => ({
        latestDomainId: store.authStore.latestDomainId,
        domains: store.authStore.domains,
        detail: store.templateStore.detail,
        search: store.templateRelationPGStore.search,
        relations: store.templateRelationPGStore.list,
        total: store.templateRelationPGStore.total,
        loading: store.loadingStore['templateRelationPGStore/GET_RELATIONS'],
        error: store.templateRelationPGStore.error
    }));
    const [callCnt, setCallCnt] = useState(0);
    const [relRows, setRelRows] = useState([]);
    const [domainRows, setDomainRows] = useState([]);
    const [domainCurrentId, setDomainCurrentId] = useState('');
    const [dcp, setDcp] = useState(false);

    useEffect(() => {
        if (search.domainId) {
            setDomainCurrentId(search.domainId);
        }
    }, [search]);

    // 도메인셀렉트의 rows 생성
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

    /**
     * row 클릭 콜백
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleRowClick = (e, row) => {};

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} newValue 변경된 값
     */
    const handleTableSearchOption = (newValue) => {
        dispatch(getRelations([changeSearchOption(newValue)]));
    };

    /**
     * 도메인 셀렉트 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeDomainId = (e) => {
        if (currentSeq) {
            dispatch(
                getRelations([
                    changeSearchOptions([
                        { key: 'page', value: 0 },
                        { key: 'domainId', value: e.target.value }
                    ])
                ])
            );
        } else {
            dispatch(changeSearchOption({ key: 'domainId', value: e.target.value }));
        }
    };

    /**
     * 페이지추가 클릭
     */
    const onAddClick = () => {};

    useEffect(() => {
        if (detail.templateSeq) {
            if (detail.domain) {
                setDcp(true);
                dispatch(
                    changeSearchOption({
                        key: 'domainId',
                        value: detail.domain.domainId
                    })
                );
            } else {
                setDcp(false);
                dispatch(
                    changeSearchOption({
                        key: 'domainId',
                        value: 'all'
                    })
                );
            }
        } else {
            if (!latestDomainId || latestDomainId === 'all') setDcp(false);
            else setDcp(true);
            dispatch(
                changeSearchOption({
                    key: 'domainId',
                    value: latestDomainId
                })
            );
        }
    }, [detail, dispatch, latestDomainId]);

    // 데이터 로딩(최초 1번)
    useEffect(() => {
        if (currentSeq) {
            if (callCnt < 1 || String(search.templateSeq) !== currentSeq) {
                dispatch(
                    getRelations([
                        changeSearchOptions([
                            { key: 'templateSeq', value: currentSeq },
                            { key: 'page', value: 0 }
                        ])
                    ])
                );
                setCallCnt(callCnt + 1);
            }
        }
    }, [dispatch, currentSeq, callCnt, search]);

    // rows 생성
    useEffect(() => {
        if (relations) {
            setRelRows(
                relations.map((t) => ({
                    id: String(t.pageSeq),
                    servicePlatform: t.domain.servicePlatform,
                    domainName: t.domain.domainName,
                    pageSeq: t.pageSeq,
                    pageName: t.pageName,
                    previewUrl: `//${t.domain.domainUrl}${t.pageUrl === '/' ? '' : t.pageUrl}`,
                    link: `/page/${t.pageSeq}`
                }))
            );
        }
    }, [relations]);

    return (
        <>
            <div className={classes.mb8}>
                <WmsSelect
                    rows={domainRows}
                    fullWidth
                    onChange={onChangeDomainId}
                    currentId={domainCurrentId}
                    disabled={dcp}
                />
            </div>
            <div className={clsx(classes.button, classes.mb8)}>
                <WmsButton color="wolf" onClick={onAddClick} href="/page">
                    <span>페이지 추가</span>
                </WmsButton>
            </div>
            <div className={classes.pageTable}>
                <WmsTable
                    columns={pageColumns}
                    rows={relRows}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onRowClick={handleRowClick}
                    onChangeSearchOption={handleTableSearchOption}
                    currentId={currentSeq}
                    loading={loading}
                    error={error}
                />
            </div>
        </>
    );
};

export default TemplateRelationPG;
