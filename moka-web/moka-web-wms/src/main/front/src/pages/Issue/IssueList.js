import React, { useEffect } from 'react';
import Search from './IssueSearch';
import AgGrid from './IssueAgGrid';
/*import { useDispatch } from 'react-redux';
import { getPackageList } from '@store/issue/issueAction';
import { initialState } from '@store/issue/issueReducer';*/

/**
 * 패키지 목록
 */
const IssueList = () => {
    /*const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getPackageList({ payload: initialState.search }));
    }, []);*/

    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default IssueList;
