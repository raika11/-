import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@/components';
import { initialState, changeSearchOption, getSourceList } from '@store/articleSource';

/**
 * 수신 매체 검색
 */
const ArticleSourceSearch = () => {
    const dispatch = useDispatch();
    const history = useHistory();
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

    /**
     * 신규 등록 버튼
     */
    const handleAddClick = () => {
        history.push('/article-sources/add');
    };

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getSourceList());
    }, [dispatch]);

    return (
        <div className="mb-2 d-flex align-items-center justify-content-between">
            <div className="d-flex">
                <div style={{ width: 120 }} className="mr-2">
                    <MokaInput className="ft-12" as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        <option value="sourceName">매체명</option>
                        <option value="sourceCode">매체코드</option>
                    </MokaInput>
                </div>
                <MokaSearchInput
                    className="mr-2"
                    inputClassName="ft-12"
                    buttonClassName="ft-12"
                    value={search.keyword}
                    name="keyword"
                    onChange={handleChangeValue}
                    onSearch={handleSearch}
                />
                <Button className="ft-12" variant="outline-table-btn">
                    초기화
                </Button>
            </div>
            <Button className="ft-12" variant="outline-table-btn" onClick={handleAddClick}>
                신규 등록
            </Button>
        </div>
    );
};

export default ArticleSourceSearch;
