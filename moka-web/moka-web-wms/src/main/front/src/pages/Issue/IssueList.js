import React, { useEffect } from 'react';
import Search from './IssueSearch';
import AgGrid from './IssueAgGrid';
import { useDispatch, useSelector } from 'react-redux';
import { changeIssueSearchOptions, GET_ISSUE_LIST, getIssueList } from '@store/issue/issueAction';

/**
 * 패키지 목록
 */
const IssueList = () => {
    const dispatch = useDispatch();
    const {
        list,
        total,
        search,
        pkg: { pkgSeq },
    } = useSelector((store) => store.issue);
    const loading = useSelector(({ loading }) => loading[GET_ISSUE_LIST]);

    useEffect(() => {
        dispatch(getIssueList({ search }));
    }, [dispatch, search]);

    const handleChangeSearchOption = (options) => {
        dispatch(changeIssueSearchOptions(options));
    };

    return (
        <>
            <Search onSearch={handleChangeSearchOption} />
            <AgGrid rowData={list} total={total} searchOptions={search} onChangeSearchOption={handleChangeSearchOption} loading={loading} selected={pkgSeq} />
        </>
    );
};

export default IssueList;
