import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import WmsSelect from '~/components/WmsSelects';
import { WmsTextFieldIcon } from '~/components/WmsTextFields';
import style from '~/assets/jss/pages/Page/PageStyle';
import { tableSearchTypes } from './components';
import { changeLatestDomainId } from '~/stores/auth/authStore';
import { getPageTree, initialState, clearPage } from '~/stores/page/pageStore';

const useStyle = makeStyles(style);

const PageSearchContainer = ({ history }) => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const orgSearch = useSelector((store) => store.pageStore.search);
    const domains = useSelector((store) => store.authStore.domains);
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const [domainRows, setDomainRows] = useState([]);
    const [search, setSearch] = useState(initialState.search);

    // 검색정보 로컬화
    useEffect(() => {
        if (orgSearch) {
            setSearch(orgSearch);
        }
        return () => {
            setSearch(initialState.search);
        };
    }, [orgSearch]);

    // 도메인 로컬화
    useEffect(() => {
        if (domains) {
            setDomainRows(
                domains.map((d) => {
                    return {
                        id: d.domainId,
                        name: d.domainName
                    };
                })
            );
        }
    }, [domains]);

    // 마지막 매체정보 변경 : domainStore의 검색조건을 변경하고, 목록도 다시 조회된다.
    useEffect(() => {
        if (latestDomainId && latestDomainId !== search.domainId) {
            const option = {
                ...search,
                domainId: latestDomainId
            };
            dispatch(getPageTree(option));
        }
    }, [dispatch, latestDomainId, search]);

    // 도메인 변경. 다른검색조건 초기화(즉시조회)
    const handleChangeDomain = useCallback(
        (e) => {
            dispatch(changeLatestDomainId(e.target.value));

            dispatch(clearPage());
            history.push('/page');
        },
        [dispatch, history]
    );

    // 검색버튼 클릭
    const onSearch = useCallback(
        (e) => {
            e.preventDefault();

            dispatch(getPageTree(search));
            history.push('/page');
        },
        [dispatch, search, history]
    );

    // 검색조건 변경
    const handleChangeSearchOption = useCallback(
        (e) => {
            setSearch({
                ...search,
                [e.target.name]: e.target.value
            });
        },
        [search]
    );

    return (
        <div className={clsx(classes.listSearchRoot, classes.mb8)}>
            <>
                <WmsSelect
                    rows={domainRows}
                    currentId={latestDomainId}
                    fullWidth
                    overrideClassName={classes.mb8}
                    onChange={handleChangeDomain}
                />
            </>
            <>
                <WmsSelect
                    rows={tableSearchTypes}
                    currentId={search.searchType}
                    width={166}
                    overrideClassName={classes.mr8}
                    name="searchType"
                    onChange={handleChangeSearchOption}
                />
                <WmsTextFieldIcon
                    placeholder="검색어를 입력하세요."
                    value={search.keyword}
                    width="calc(100% - 174px)"
                    icon="search"
                    name="keyword"
                    onChange={handleChangeSearchOption}
                    onIconClick={onSearch}
                    onEnter={onSearch}
                />
            </>
        </div>
    );
};

export default withRouter(PageSearchContainer);
