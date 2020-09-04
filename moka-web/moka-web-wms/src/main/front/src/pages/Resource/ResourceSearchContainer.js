import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import WmsSelect from '~/components/WmsSelects';
import { WmsTextFieldIcon } from '~/components/WmsTextFields';
import { changeSearchOption, getTemplates } from '~/stores/template/templateStore';
import { changeLatestDomainId } from '~/stores/auth/authStore';
import style from '~/assets/jss/pages/Template/TemplateStyle';

/**
 * TemplateSearch Style
 */
const useStyle = makeStyles(style);
const defaultDomain = { id: 'all', name: '공통 도메인' };
const defaultSearchType = [
    { id: 'all', name: '컨테이너 전체' },
    { id: 'templateSeq', name: '컨테이너ID' },
    { id: 'templateName', name: '컨테이너명' }
];

const ResourceSearchContainer = () => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const { domains, search, latestDomainId } = useSelector((store) => ({
        domains: store.authStore.domains,
        latestDomainId: store.authStore.latestDomainId,
        search: store.templateStore.search
    }));
    const [domainRows, setDomainRows] = useState([]);
    const [domainCurrentId, setDomainCurrentId] = useState('all');

    const [searchTypeCurrentId, setSearchTypeCurrentId] = useState('all');
    const [keyword, setKeyword] = useState('');
    const keywordRef = useRef();

    // search 값으로 currentId 변경
    useEffect(() => {
        setSearchTypeCurrentId(search.searchType || 'all');
        setKeyword(search.keyword || '');
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
        dispatch(
            getTemplates(
                changeSearchOption({
                    key: 'page',
                    value: 0
                }),
                changeSearchOption({
                    key: 'domainId',
                    value: search.domainId
                })
            )
        );
    }, [search.domainId, dispatch]);

    // latestDomainId로 리스트를 조회한다
    useEffect(() => {
        setDomainCurrentId(latestDomainId);
        dispatch(
            changeSearchOption({
                key: 'domainId',
                value: latestDomainId
            })
        );
    }, [latestDomainId, dispatch]);

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
    };

    /**
     * 리소스 검색 조건 변경 함수
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
     * 리소스 키워드 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeKeyword = (e) => {
        setKeyword(e.target.value);
    };

    /**
     * 리소스 검색
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
        <div className={clsx(classes.root, classes.mb8)}>
            <>
                <WmsSelect
                    rows={domainRows}
                    currentId={domainCurrentId}
                    fullWidth
                    overrideClassName={classes.mb8}
                    onChange={onChangeDomainId}
                />
            </>
            <>
                <WmsSelect
                    rows={defaultSearchType}
                    currentId={searchTypeCurrentId}
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

export default ResourceSearchContainer;
