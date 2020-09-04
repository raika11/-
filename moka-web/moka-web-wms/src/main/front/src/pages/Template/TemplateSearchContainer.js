import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsSelect, WmsTextFieldIcon } from '~/components';
import {
    changeSearchOption,
    changeSearchOptions,
    getTemplates
} from '~/stores/template/templateStore';
import { getTPZone, getTPSize } from '~/stores/etccodeType/etccodeTypeStore';
import { changeLatestDomainId } from '~/stores/auth/authStore';
import style from '~/assets/jss/pages/Template/TemplateStyle';

/**
 * TemplateSearch Style
 */
const useStyle = makeStyles(style);
export const defaultDomain = { id: 'all', name: '공통 도메인' };
const defaultTPZone = { id: 'all', name: '위치그룹 전체' };
const defaultTPSize = { id: 'all', name: '사이즈 전체' };
const defaultSearchType = [
    { id: 'all', name: '템플릿 전체' },
    { id: 'templateSeq', name: '템플릿ID' },
    { id: 'templateName', name: '템플릿명' },
    { id: 'templateBody', name: '템플릿본문' }
];

/**
 * 컴포넌트 검색 컨테이너
 */
const TemplateSearchContainer = () => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const history = useHistory();
    const { domains, tpSizeRows, tpZoneRows, search, latestDomainId } = useSelector((store) => ({
        domains: store.authStore.domains,
        latestDomainId: store.authStore.latestDomainId,
        search: store.templateStore.search,
        tpSizeRows: store.etccodeTypeStore.tpSizeRows,
        tpZoneRows: store.etccodeTypeStore.tpZoneRows
    }));
    const [loadCnt, setLoadCnt] = useState(0);
    const [sizeRows, setSizeRows] = useState([]);
    const [zoneRows, setZoneRows] = useState([]);
    const [domainRows, setDomainRows] = useState([]);
    const [keyword, setKeyword] = useState('');

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
    }, [loadCnt, tpSizeRows, tpZoneRows, dispatch]);

    // search 값으로 currentId 변경
    useEffect(() => {
        if (search.keyword) {
            setKeyword(search.keyword);
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

    useEffect(() => {
        dispatch(changeSearchOptions([{ key: 'domainId', value: latestDomainId || 'all' }]));
    }, [latestDomainId, dispatch]);

    useEffect(() => {
        dispatch(getTemplates(changeSearchOption({ key: 'page', value: 0 })));
    }, [dispatch, search.domainId]);

    /**
     * 도메인 셀렉트 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeDomainId = (e) => {
        dispatch(
            changeSearchOption({
                key: 'domainId',
                value: e.target.value
            })
        );
        if (e.target.value !== 'all') {
            // latestDomainId에 all이 저장되지 않도록 한다!
            dispatch(changeLatestDomainId(e.target.value));
        }
        history.push('/template');
    };

    /**
     * 도메인 위치그룹 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeTpZone = (e) => {
        dispatch(changeSearchOption({ key: 'tpZone', value: e.target.value }));
    };

    /**
     * 템플릿 사이즈 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeSizeZone = (e) => {
        if (e.target.value === 'all') {
            dispatch(
                changeSearchOptions([
                    { key: 'widthMin', value: undefined },
                    { key: 'widthMax', value: undefined },
                    { key: 'tpSize', value: 'all' }
                ])
            );
            return;
        }
        try {
            const { codeNameEtc1, codeNameEtc2 } = e.target.selectedOptions[0].dataset;
            dispatch(
                changeSearchOptions([
                    { key: 'widthMin', value: Number(codeNameEtc1) },
                    { key: 'widthMax', value: Number(codeNameEtc2) },
                    { key: 'tpSize', value: e.target.value }
                ])
            );
        } catch (err) {
            dispatch(
                changeSearchOptions([
                    { key: 'widthMin', value: undefined },
                    { key: 'widthMax', value: undefined },
                    { key: 'tpSize', value: 'all' }
                ])
            );
        }
    };

    /**
     * 템플릿 검색 조건 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeSearchType = (e) => {
        dispatch(
            changeSearchOption({
                key: 'searchType',
                value: e.target.value
            })
        );
    };

    /**
     * 템플릿 키워드 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeKeyword = (e) => {
        setKeyword(e.target.value);
    };

    /**
     * 템플릿 검색
     * @param {object} e click이벤트
     */
    const onSearch = (e) => {
        dispatch(
            getTemplates(
                changeSearchOption({
                    key: 'keyword',
                    value: keyword
                }),
                changeSearchOption({
                    key: 'page',
                    value: 0
                })
            )
        );
    };

    return (
        <div className={clsx(classes.listSearchRoot, classes.mb8)}>
            <>
                <WmsSelect
                    rows={domainRows}
                    currentId={search.domainId}
                    fullWidth
                    overrideClassName={classes.mb8}
                    onChange={onChangeDomainId}
                />
            </>
            <>
                <WmsSelect
                    rows={zoneRows}
                    currentId={search.tpZone}
                    width={227}
                    overrideClassName={clsx(classes.mb8, classes.mr8)}
                    onChange={onChangeTpZone}
                />
                <WmsSelect
                    rows={sizeRows}
                    currentId={search.defaultTPSize}
                    width="calc(100% - 235px)"
                    overrideClassName={classes.mb8}
                    onChange={onChangeSizeZone}
                />
            </>
            <>
                <WmsSelect
                    rows={defaultSearchType}
                    currentId={search.searchType}
                    width={166}
                    overrideClassName={classes.mr8}
                    onChange={onChangeSearchType}
                />
                <WmsTextFieldIcon
                    placeholder="검색어를 입력하세요."
                    value={keyword}
                    width="calc(100% - 174px)"
                    icon="search"
                    onChange={onChangeKeyword}
                    onIconClick={onSearch}
                    onEnter={onSearch}
                />
            </>
        </div>
    );
};

export default TemplateSearchContainer;
