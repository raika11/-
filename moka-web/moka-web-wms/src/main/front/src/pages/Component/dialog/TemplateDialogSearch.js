import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextFieldIcon, WmsSelect } from '~/components';
import {
    changeSearchOption,
    changeSearchOptions,
    clearSearchOption,
    getTemplates
} from '~/stores/template/templateStore';
import { getTPZone, getTPSize } from '~/stores/etccodeType/etccodeTypeStore';
import ComponentDialogButton from '../components/ComponentDialogButton';
import style from '~/assets/jss/pages/DialogStyle';

const useStyles = makeStyles(style);
const defaultDomain = { id: 'all', name: '공통 도메인' };
const defaultTPZone = { id: 'all', name: '위치그룹 전체' };
const defaultTPSize = { id: 'all', name: '사이즈 전체' };
const defaultSearchType = [
    { id: 'all', name: '템플릿 전체' },
    { id: 'templateSeq', name: '템플릿ID' },
    { id: 'templateName', name: '템플릿명' },
    { id: 'templateBody', name: '템플릿본문' }
];

const TemplateDialogSearch = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { domains, tpSizeRows, tpZoneRows, latestDomainId, search } = useSelector((store) => ({
        domains: store.authStore.domains,
        latestDomainId: store.authStore.latestDomainId,
        search: store.templateStore.search,
        tpSizeRows: store.etccodeTypeStore.tpSizeRows,
        tpZoneRows: store.etccodeTypeStore.tpZoneRows
    }));
    const [sizeRows, setSizeRows] = useState([]);
    const [zoneRows, setZoneRows] = useState([]);
    const [domainRows, setDomainRows] = useState([]);
    const [domainCurrentId, setDomainCurrentId] = useState(latestDomainId);
    const [keyword, setKeyword] = useState('');
    const [initialCnt, setInitialCnt] = useState(0);

    // 도메인셀렉트의 rows 생성(현재 도메인과 공통 도메인만 선택 가능)
    useEffect(() => {
        if (domains) {
            const match = domains.filter((m) => m.domainId === latestDomainId);
            const rows1 = match.map((m) => ({
                id: m.domainId,
                name: m.domainName
            }));
            rows1.unshift(defaultDomain);
            setDomainRows(rows1);
        }
    }, [domains, latestDomainId]);

    // 초기 데이터 로드
    useEffect(() => {
        if (initialCnt < 1) {
            dispatch(
                getTemplates(
                    clearSearchOption(),
                    changeSearchOption({
                        key: 'domainId',
                        value: domainCurrentId
                    })
                )
            );
            if (tpZoneRows.length <= 1) {
                dispatch(getTPZone());
            }
            if (tpSizeRows.length <= 1) {
                dispatch(getTPSize());
            }
            setInitialCnt(initialCnt + 1);
        } else {
            setSizeRows([].concat(defaultTPSize, tpSizeRows));
            setZoneRows([].concat(defaultTPZone, tpZoneRows));
        }
    }, [domainCurrentId, dispatch, initialCnt, tpZoneRows, tpSizeRows]);

    // 언마운트시 search option clear
    useEffect(() => {
        return () => {
            dispatch(clearSearchOption());
        };
    }, [dispatch]);

    /**
     * 도메인 셀렉트 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeDomainId = (e) => {
        setDomainCurrentId(e.target.value);
        dispatch(
            getTemplates(
                changeSearchOptions([
                    { key: 'page', value: 0 },
                    { key: 'domainId', value: e.target.value }
                ])
            )
        );
    };

    /**
     * 도메인 위치그룹 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeTpZone = (e) => {
        dispatch(
            changeSearchOption({
                key: 'tpZone',
                value: e.target.value
            })
        );
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
     * 검색 조건 변경 함수
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
     * 키워드 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeKeyword = (e) => {
        setKeyword(e.target.value);
    };

    /**
     * 검색
     * @param {object} e click이벤트
     */
    const onSearch = (e) => {
        dispatch(
            getTemplates(
                changeSearchOption({
                    key: 'keyword',
                    value: keyword
                })
            )
        );
    };

    return (
        <>
            <div className={classes.mb8}>
                <WmsSelect
                    rows={domainRows}
                    width={340}
                    overrideClassName={classes.mr8}
                    onChange={onChangeDomainId}
                    currentId={domainCurrentId}
                />
                <WmsSelect
                    rows={zoneRows}
                    width="calc(100% - 348px)"
                    onChange={onChangeTpZone}
                    currentId={search.tpZone}
                />
            </div>

            <div className={clsx(classes.inLine, classes.mb8)}>
                <WmsSelect
                    rows={sizeRows}
                    width={103}
                    overrideClassName={classes.mr8}
                    onChange={onChangeSizeZone}
                    currentId={search.tpSize}
                />
                <WmsSelect
                    rows={defaultSearchType}
                    width={109}
                    overrideClassName={classes.mr8}
                    onChange={onChangeSearchType}
                    currentId={search.searchType}
                />
                <WmsTextFieldIcon
                    placeholder="검색어를 입력하세요."
                    width="calc(100% - 304px)"
                    icon="search"
                    value={keyword}
                    overrideClassName={classes.mr8}
                    onChange={onChangeKeyword}
                    onIconClick={onSearch}
                    onEnter={onSearch}
                />
                <ComponentDialogButton />
            </div>
        </>
    );
};

export default TemplateDialogSearch;
