import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextFieldIcon, WmsSelect } from '~/components';
import {
    changeSearchOption,
    changeSearchOptions,
    clearSearchOption,
    getSkins
} from '~/stores/skin/skinStore';
import style from '~/assets/jss/pages/DialogStyle';

const useStyle = makeStyles(style);
const defaultSearchType = [{ id: 'all', name: '스킨 전체' }];

const SkinDialogSearch = () => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const { latestDomainId, search } = useSelector((store) => ({
        latestDomainId: store.authStore.latestDomainId,
        search: store.skinStore.search
    }));
    const [keyword, setKeyword] = useState('');
    const [initialCnt, setInitialCnt] = useState(0);

    // search 값으로 currentId 변경
    useEffect(() => {
        setKeyword(search.keyword || '');
    }, [search]);

    useEffect(() => {
        if (initialCnt < 1) {
            dispatch(
                getSkins(
                    clearSearchOption(),
                    changeSearchOption({ key: 'domainId', value: latestDomainId })
                )
            );
            setInitialCnt(initialCnt + 1);
        }
    }, [latestDomainId, dispatch, initialCnt]);

    // 언마운트시 search option clear
    useEffect(() => {
        return () => {
            dispatch(clearSearchOption());
        };
    }, [dispatch]);

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
            getSkins(
                changeSearchOptions([
                    { key: 'page', value: 0 },
                    { key: 'keyword', value: keyword }
                ])
            )
        );
    };

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
                width="268"
                icon="search"
                name="keyword"
                onChange={onChangeKeyword}
                onIconClick={onSearch}
                onEnter={onSearch}
            />
        </div>
    );
};

export default SkinDialogSearch;
