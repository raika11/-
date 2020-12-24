import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaSearchInput } from '@/components';
import { initialState, changeSearchOption, getSourceList } from '@store/articleSource';

/**
 * 수신 매체 검색
 */
const ArticleSourceSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.articleSource.search);

    // local state
    const [search, setSearch] = useState(initialState.search);

    /**
     * 검색 keyword 변경
     * @param {object} e event
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색 버튼
     */
    const handleSearch = () => {
        dispatch(
            getSourceList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    };

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getSourceList());
    }, [dispatch]);

    return (
        <div className="mb-2 d-flex">
            <MokaSearchInput className="mr-2" value={search.keyword} name="keyword" onChange={handleChangeValue} onSearch={handleSearch} />
            <Button>초기화</Button>
        </div>
    );
};

export default ArticleSourceSearch;
