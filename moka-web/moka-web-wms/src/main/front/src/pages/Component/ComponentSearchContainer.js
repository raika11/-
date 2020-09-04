import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextFieldIcon, WmsSelect } from '~/components';
import { getTPZone } from '~/stores/etccodeType/etccodeTypeStore';
import { changeSearchOption, getComponents } from '~/stores/component/componentStore';
import { changeLatestDomainId } from '~/stores/auth/authStore';
import style from '~/assets/jss/pages/Component/ComponentStyle';

const useStyle = makeStyles(style);
const defaultTPZone = { id: 'all', name: '위치그룹 전체' };
const defaultSearchType = [
    { id: 'all', name: '컴포넌트 전체' },
    { id: 'componentSeq', name: '컴포넌트ID' },
    { id: 'componentName', name: '컴포넌트명' },
    { id: 'templateSeq', name: '템플릿ID' },
    { id: 'templateName', name: '템플릿명' }
];

const ComponentSearchContainer = () => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const history = useHistory();
    const { domains, latestDomainId, search, tpZoneRows } = useSelector((store) => ({
        latestDomainId: store.authStore.latestDomainId,
        domains: store.authStore.domains,
        search: store.componentStore.search,
        tpZoneRows: store.etccodeTypeStore.tpZoneRows
    }));
    const [loadCnt, setLoadCnt] = useState(0);
    const [domainRows, setDomainRows] = useState([]);
    const [zoneRows, setZoneRows] = useState([]);
    const [keyword, setKeyword] = useState('');
    const keywordRef = useRef();

    // 위치그룹 코드 조회
    useEffect(() => {
        if (loadCnt < 1) {
            dispatch(getTPZone());
            setLoadCnt(loadCnt + 1);
        } else {
            setZoneRows([].concat(defaultTPZone, tpZoneRows));
        }
    }, [tpZoneRows, dispatch, loadCnt]);

    // 도메인셀렉트의 rows 생성
    useEffect(() => {
        if (domains) {
            const rows1 = domains.map((m) => {
                return {
                    id: m.domainId,
                    name: m.domainName
                };
            });
            setDomainRows(rows1);
        }
    }, [domains]);

    useEffect(() => {
        if (search.keyword) {
            setKeyword(search.keyword);
        }
    }, [search]);

    // latestDomainId를 search에 셋팅
    useEffect(() => {
        dispatch(
            changeSearchOption({
                key: 'domainId',
                value: latestDomainId
            })
        );
    }, [latestDomainId, dispatch]);

    // search의 domainId가 변경되면 목록 조회
    useEffect(() => {
        if (search.domainId) {
            dispatch(
                getComponents(
                    changeSearchOption({
                        key: 'page',
                        value: 0
                    })
                )
            );
        }
    }, [search.domainId, dispatch]);

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
        dispatch(changeLatestDomainId(e.target.value));
        history.push('/component');
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
            getComponents(
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
                    fullWidth
                    overrideClassName={clsx(classes.mb8, classes.mr8)}
                    onChange={onChangeTpZone}
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
                    inputRef={keywordRef}
                />
            </>
        </div>
    );
};

export default ComponentSearchContainer;
